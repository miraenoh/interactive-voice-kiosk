const LANG_CODE = 'ko-KR'
const AUDIO_ENCODING = 'LINEAR16'

module.exports = {
	TOKEN_KEY: 'secretToken',
	TOKEN_EXP_SECS: 3600, // an hour
	CONV_EXP_SECS: 3600, // an hour
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
			languageCode: LANG_CODE,
			enableAutomaticPunctuation: false
		},
		GCS_URI: 'gs://voice-user/'
	},
	GC_STORAGE: {
		BUCKET_NAME_BOT: 'voice-bot',
		BUCKET_NAME_USER: 'voice-user',
		LOCAL_PATH: './temp/',
		FILE_FORMAT: '.wav'
	},
	SCRIPT: {
		HELLO: '안녕하세요',
		RECOG_FAILED: '죄송합니다. 알아 듣지 못했어요. 다시 말씀해주세요.',
		ORDER_FAILED: '말씀하신 내용으로는 주문할 수 없어요. 다시 주문해주세요.',
		ORDER_RECEIVED: '주문이 접수되었습니다.'
	},
	NUMBERS_DICT: {
		하나: 1,
		한: 1,
		두: 2,
		둘: 2,
		세: 3,
		셋: 3,
		네: 4,
		넷: 4,
		다섯: 5,
		여섯: 6,
		일곱: 7,
		여덟: 8,
		아홉: 9
	}
}
