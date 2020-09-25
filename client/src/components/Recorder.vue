<template>
	<vs-button-group>
		<vs-button @click="startRecorder" relief success icon>
			<i class="bx bxs-microphone"></i>
		</vs-button>
		<vs-button @click="stopRecorder" relief danger icon>
			<i class="bx bx-stop"></i>
		</vs-button>
	</vs-button-group>
</template>

<script>
import axios from 'axios'

import Recorder from '../utils/vue-audio-recorder/recorder'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	props: {
		fileName: { type: String, defulat: 'sample' }
	},
	data: function() {
		return {
			recorder: this._initRecorder(),
			record: null,
		}
	},
	computed: {
		isRecording() {
			return this.recorder.isRecording
		}
	},
	beforeDestroy() {
		this.stopRecorder()
	},
	methods: {
		_initRecorder() {
			return new Recorder({
				beforeRecording: this.callback,
				afterRecording: this.callback,
				pauseRecording: this.callback,
				micFailed: this.callback,
				bitRate: 192,
				sampleRate: 44100,
				format: 'wav'
			})
		},
		startRecorder() {
			if (!this.isRecording) {
				this.recorder.start()
			}
		},
		stopRecorder() {
			if (this.isRecording) {
				this.recorder.stop()
				this.record = this.recorder.recordList()[0]
				console.log('record')
				console.log(this.record)

				this.recorder = this._initRecorder()

				// Send the file to the server
				this.sendAudioFile(this.record.blob).then(() => {
					// Terminate the recorder after the file uploading is done
					this.$emit('recordDone', true)
				})
			}
		},
		async sendAudioFile(file) {
			const formData = new FormData()
			const fileName = this.fileName + '.wav'
			formData.append('audio-file', file, fileName)

			const res = await axios.post(endpoint + '/api/file/upload', formData, {
				headers: { filename: this.fileName }
			})

			return true
		},
		download() {
			if (!this.record.url) return

			const type = this.record.blob.type.split('/')[1]
			const link = document.createElement('a')
			link.href = this.record.url
			link.download = `${this.fileName}.${type}`
			link.click()
		},
		callback(msg) {
			console.log('Event: ', msg)
		}
	}
}
</script>

<style></style>
