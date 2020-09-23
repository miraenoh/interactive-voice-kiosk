module.exports = {
	TOKEN_KEY: 'secretToken',
	TOKEN_EXP_SECS: 86400, // a day
	TTS: {
		LANG_CODE: 'ko-KR',
		VOICE_NAME: 'ko-KR-Wavenet-B',
		AUDIO_ENCODING: 'LINEAR16',
		VOICE_PITCH: 2
	},
	GC_STORAGE: {
		BUCKET_NAME_BOT: 'voice-bot',
		BUCKET_NAME_USER: 'voice-user'
	},
	SCRIPT: {
		START: '안녕하세요. 주문하시겠어요?'
	}
}
