const gcsUrl = 'https://storage.googleapis.com/voice-bot/'

export default {
    playAudio: async (fileName) => {
        const audio = new Audio(gcsUrl + fileName + '.wav')
        audio.play()

        audio.addEventListener('ended', () => {
            return true
        })
    }
}
