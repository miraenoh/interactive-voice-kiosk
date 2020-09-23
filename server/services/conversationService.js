const fs = require('fs')
const util = require('util')

// Setting for GC client library use
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const textToSpeech = require('@google-cloud/text-to-speech')
const client = new textToSpeech.TextToSpeechClient()

const GC_STORAGE = require('../constants').GC_STORAGE
const TTS = require('../constants').TTS
const SCRIPT = require('../constants').SCRIPT

module.exports = {
	start: async (userId) => {
		// Make start audio from API
		await this.makeVoice(userId, SCRIPT.START)

		return true
	},
	makeVoice: async (userId, text) => {
		// Construct the request
		const request = {
			input: { text: text },
			voice: {
				languageCode: TTS.LANG_CODE,
				name: TTS.VOICE_NAME
			},
			audioConfig: {
				audioEncoding: TTS.AUDIO_ENCODING,
				pitch: TTS.VOICE_PITCH
			}
		}

		// Perform the request
		const [response] = await client.synthesizeSpeech(request)

		// Write the audio content to GC cloud
		// First save the audio to a local file
		const filePath = './temp/' + userId + '.wav'
		const writeFile = util.promisify(fs.writeFile)
		await writeFile(filePath, response.audioContent, 'binary')
		// Upload the file to GC cloud
		await storage.bucket(GC_STORAGE.BUCKET_NAME_USER).upload(filePath, {
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
}
