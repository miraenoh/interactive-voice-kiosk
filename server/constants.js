const LANG_CODE = 'ko-KR'
const AUDIO_ENCODING = 'LINEAR16'

module.exports = {
	TOKEN_KEY: 'secretToken',
	TOKEN_EXP_SECS: 86400, // a day
	TTS: {
		VOICE_CONFIG: {
			languageCode: LANG_CODE,
			name: 'ko-KR-Wavenet-A'
		},
		AUDIO_CONFIG: {
			audioEncoding: AUDIO_ENCODING,
			pitch: -1.5
		}
	},
	STT: {
		CONFIG: {
			encoding: AUDIO_ENCODING,
			sampleRateHertz: 16000,
			languageCode: LANG_CODE,
			enableAutomaticPunctuation: true
		},
		GCS_URI: 'gs://voice-user/'
	},
	GC_STORAGE: {
		BUCKET_NAME_BOT: 'voice-bot',
		BUCKET_NAME_USER: 'voice-user'
	},
	SCRIPT: {
		HELLO: '안녕하세요',
		RECOG_FAILED: '죄송합니다. 알아 듣지 못했어요. 다시 말씀해주세요.',
		ORDER_FAILED: '말씀하신 내용으로는 주문할 수 없어요. 다시 주문해주세요.',
		ORDER_RECEIVED: '주문이 접수되었습니다.'
	}
}
