const fs = require('fs')
const util = require('util')

// Setting for GC client library use
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const textToSpeech = require('@google-cloud/text-to-speech')
const ttsClient = new textToSpeech.TextToSpeechClient()
const speech = require('@google-cloud/speech')
const sttClient = new speech.SpeechClient()

const { Conversation } = require('../models/Conversation')
const { Order } = require('../models/Order')
const { Menu } = require('../models/Menu')
const { User } = require('../models/User')

const GC_STORAGE = require('../constants').GC_STORAGE
const TTS = require('../constants').TTS
const STT = require('../constants').STT
const SCRIPT = require('../constants').SCRIPT

// Module functions
// Start a conversation
const start = async (conversation) => {
	// Make a script
	// Get storeName
	const user = await User.findOne({ name: conversation.userId }).exec()
	const script = SCRIPT.HELLO + ', ' + user.storeName + '입니다. 말로 주문해주세요.'

	// Make start audio from API
	await makeVoice(conversation.id, script)

	return true
}

// Recognize the user's voice and process the result
// Return boolean hasFinished
const processOrder = async (conversation, cb) => {
	const convId = conversation._id
	let result = { id: convId, success: true, hasFinished: false }

	// Recognize the user's voice
	/* 	const transcript = await recognizeVoice(conversation._id)
	console.log(transcript) */
	const transcript = '아메리카노 하나랑 카페라떼 하나요.'

	// Check if suceeded to recognize
	if (!transcript || !transcript.length) {
		// Failed to recognize the voice
		// Make the Fail response
		result.success = false
		result.message = 'Failed to recognize the voice.'

		// Make the audio
		await makeVoice(convId, SCRIPT.RECOG_FAILED)

		return cb(result)
	}

	// Try creating the order with the transcript
	const orderData = await createOrder(transcript, conversation)
	if (orderData) {
		// Succeeded to create the order
		// Store the order
		const order = new Order(orderData)
		await order.save()

		// Update the user's lastOrderNo
		await User.findOneAndUpdate({ name: order.userId }, { lastOrderNo: order.orderNo }).exec()

		// Create the info voice
		const script = SCRIPT.ORDER_RECEIVED + ' 총 금액은 ' + order.totalPrice + '원 입니다.'
		await makeVoice(convId, script)

		// Remove the conversation from mongodb
		await Conversation.findOneAndDelete({ _id: convId }).exec()

		// Return the res with order data
		result.hasFinished = true
		result.order = orderData
		return cb(result)
	} else {
		// Failed to create the order
		// Make the Fail response
		result.success = false
		result.message = 'Failed to create an order from the transcript.'

		// Make the audio
		await makeVoice(convId, SCRIPT.ORDER_FAILED)

		return cb(result)
	}
}

const createOrder = async (transcript, conversation) => {
	// Load the store's data from mongodb
	const menus = await Menu.find({ userId: conversation.userId }).exec()

	// Find ordered menus
	let selectedMenus = []
	let words = transcript.split(' ')
	for (let menu of menus) {
		for (let i_word in words) {
			if (words[i_word].includes(menu.name)) {
				// Found menu
				const selectedMenu = {
					id: menu._id,
					name: menu.name,
					price: menu.price,
					number: 1
				}
				selectedMenus.push(selectedMenu)

				// Delete the word from the array
				words[i_word] = words[words.length - 1]
				words.pop()
			}
		}
	}

	// Check if found any menus
	if (selectedMenus.length) {
		// Success
		// Create and return the order
		const userId = conversation.userId
		const totalPrice = calculateTotalPrice(selectedMenus)
		const orderNo = await calculateOrderNo(userId)
		const order = {
			_id: conversation._id,
			userId: userId,
			orderNo: orderNo,
			totalPrice: totalPrice,
			menus: selectedMenus
		}

		return order
	} else {
		// No menu found
		return null
	}
}

// Recognize the user's voice and return the transcript
const recognizeVoice = async (fileName, text) => {
	// Recognize the user's voice with GC Speech-to-Text API
	// Construct the request
	const config = STT.CONFIG
	const audio = { uri: STT.GCS_URI + fileName + '.raw' }
	const request = { config: config, audio: audio }

	// Detect the transcription with GC STT and process the response
	const [response] = await sttClient.recognize(request)
	const transcription = response.results
		.map((result) => result.alternatives[0].transcript)
		.join('\n')

	return transcription
}

// Synthesize voice with the given text
const makeVoice = async (fileName, text) => {
	// Construct the request
	const request = {
		input: { text: text },
		voice: TTS.VOICE_CONFIG,
		audioConfig: TTS.AUDIO_CONFIG
	}

	// Perform the request
	const [response] = await ttsClient.synthesizeSpeech(request)

	// Write the audio content to GC cloud
	// First save the audio to a local file
	const filePath = './temp/' + fileName + '.wav'
	const writeFile = util.promisify(fs.writeFile)
	await writeFile(filePath, response.audioContent, 'binary')
	// Upload the file to GC cloud
	await storage.bucket(GC_STORAGE.BUCKET_NAME_BOT).upload(filePath, {
		gzip: true,
		metadata: {
			cacheControl: 'no-cache'
		}
	})
	// Delete the local file
	const unlink = util.promisify(fs.unlink)
	await unlink(filePath)

	return true
}

const calculateTotalPrice = (menus) => {
	let totalPrice = 0
	for (menu of menus) totalPrice += menu.price * menu.number

	return totalPrice
}

const calculateOrderNo = async (userId) => {
	// Load the user and retrieve lastOrderNo
	const user = await User.findOne({ name: userId }).exec()
	const orderNo = user.lastOrderNo + 1

	return orderNo
}

module.exports = {
	start: start,
	processOrder: processOrder,
	recognizeVoice: recognizeVoice,
	makeVoice: makeVoice
}
