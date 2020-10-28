const fs = require('fs')
const util = require('util')

// Setting for GC client library use
const textToSpeech = require('@google-cloud/text-to-speech')
const ttsClient = new textToSpeech.TextToSpeechClient()
const speech = require('@google-cloud/speech')
const sttClient = new speech.SpeechClient()

const { Conversation } = require('../models/Conversation')
const { Order } = require('../models/Order')
const { Menu } = require('../models/Menu')
const { User } = require('../models/User')

const gcStorageService = require('./gcStorageService')

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

	// Check if the info voice already exists
	const storeName = user.storeName
	const exists = await gcStorageService.fileExists(
		GC_STORAGE.BUCKET_NAME_BOT,
		storeName + GC_STORAGE.FILE_FORMAT
	)
	if (exists) {
		console.log('exists')
		// Info file already exists
		// Skip making the voice
		return true
	} else {
		// Info file not exists
		// Make the voice
		console.log('not exists')
		const script = SCRIPT.HELLO + ', ' + storeName + '입니다. 말로 주문해주세요.'
		await makeVoice(user.storeName, script)

		return true
	}
}

// Recognize the user's voice and process the result
// Return boolean hasFinished
const processOrder = async (conversation, cb) => {
	const convId = conversation._id
	let result = { id: convId, success: true, hasFinished: false }

	// Recognize the user's voice
	const transcript = await recognizeVoice(conversation._id)
	console.log(transcript)

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

// Create the order information by analizing the trascript
const createOrder = async (transcript, conversation) => {
	// Load the store's data from mongodb
	const menus = await Menu.find({ userId: conversation.userId }).exec()

	// Find ordered menus
	let selectedMenus = []
	let words = transcript.split(' ')
	let i_word = 0
	while (i_word < words.length) {
		for (let menu of menus) {
			let menuName = menu.name.split(' ').join('')
			let selectedMenu = {
				id: menu._id,
				name: menu.name,
				price: menu.price,
				number: 1
			}

			// Check if the menuName starts with the word
			const i_word_ori = i_word
			let hasFound = false
			while (menuName.indexOf(words[i_word]) >= 0) {
				menuName = menuName.replace(words[i_word], '')
				if (menuName.length == 0) {
					hasFound = true
					break
				}

				i_word++
			}

			if (!hasFound) {
				i_word = i_word_ori
			} else {
				// Found the menu
				selectedMenus.push(selectedMenu)
				break
			}
		}

		i_word++
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

	// const content = await readAudio('./temp/5f6c40d8a57f40730ce8da7f.wav')
	const content = await readAudio(GC_STORAGE.LOCAL_PATH + fileName + GC_STORAGE.FILE_FORMAT)
	const audio = {
		content: content
	}

	// const audio = { uri: STT.GCS_URI + fileName + '.wav' }
	const request = { config: config, audio: audio }

	// Detect the transcription with GC STT and process the response
	const [response] = await sttClient.recognize(request)
	const transcription = response.results
		.map((result) => result.alternatives[0].transcript)
		.join('\n')

	return transcription
}

const readAudio = async (filePath) => {
	const readFile = util.promisify(fs.readFile)
	const content = (await readFile(filePath)).toString('base64')

	return content
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
	const filePath = GC_STORAGE.LOCAL_PATH + fileName + GC_STORAGE.FILE_FORMAT
	const writeFile = util.promisify(fs.writeFile)
	await writeFile(filePath, response.audioContent, 'binary')
	// Upload the file to GC cloud
	await gcStorageService.uploadFile(GC_STORAGE.BUCKET_NAME_BOT, filePath)

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
