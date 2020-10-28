<template>
	<div class="grid">
		<audio ref="audio" @ended="handleAfterAudio"></audio>
		<vs-row justify="center">
			<vs-col lg="7" sm="9" xs="11">
				<h1 class="center">
					{{ user.storeName }}
				</h1>
				<vs-row class="container">
					<vs-row class="my-description-text" justify="center">
						메뉴를 고른 뒤 버튼을 눌러 주문하세요.
					</vs-row>
					<vs-col
						class="my-menu-col"
						v-for="menuGroup in menuGroups"
						:key="menuGroup._id"
						w="6"
						sm="12"
					>
						<my-menus-table :menuGroup="menuGroup" :isAdmin="false" class="my-small-card" />
					</vs-col>
				</vs-row>
			</vs-col>
		</vs-row>
		<vs-dialog class="my-dialog" v-model="dialog">
			<my-receipt :order="dialogData" />
		</vs-dialog>
		<div class="bottomRight">
			<my-recorder
				@recordDone="proceedConversation"
				v-if="conversation.isRecording"
				:fileName="conversation.id"
			/>
			<vs-avatar
				class="my-bot-avatar"
				@click="handleClick"
				circle
				:primary="!conversation.isRecording"
				:color="conversation.isRecording ? '#dddddd' : null"
				size="110"
				:loading="conversation.isWaiting"
				:badge="conversation.isWriting"
				:writing="conversation.isWriting"
			>
				<i class="bx bxs-bot"></i>
			</vs-avatar>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

import MenusTable from '../components/MenusTable'
import Recorder from '../components/Recorder'
import Receipt from '../components/Receipt'

const gcsUrl = 'https://storage.googleapis.com/voice-bot/'
const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myMenusTable: MenusTable,
		myRecorder: Recorder,
		myReceipt: Receipt
	},
	props: ['id'],
	data: function() {
		return {
			user: {},
			menuGroups: [],
			conversation: {
				id: null,
				success: false,
				hasFinished: false,
				isWriting: false,
				isWaiting: false,
				isRecording: false
			},
			dialog: false,
			dialogData: {}
		}
	},
	async mounted() {
		const loading = this.$vs.loading()

		// Check if the user exists
		let res = await axios.get(endpoint + '/api/user', { params: { id: this.id } })
		this.user = res.data

		// Get all menuGroups by userId
		res = await axios.get(endpoint + '/api/menu/group/by-user', { params: { userId: this.id } })
		this.menuGroups = res.data

		loading.close()
	},
	methods: {
		async handleClick() {
			if (!this.conversation.id) {
				this.startConversation()
			}
		},
		async startConversation() {
			// Start a conversation with the bot
			this.conversation.isWaiting = true
			// Send the start request to the server
			const res = await axios.get(endpoint + '/api/conversation/start', {
				params: { userId: this.id }
			})
			this.conversation.id = res.data.id
			this.updateConvData(res.data)

			this.conversation.isWaiting = false

			// Play the bot's voice from the response
			this.conversation.isWriting = true
			this.$refs['audio'].src = gcsUrl + this.user.storeName + '.wav'
			this.$refs['audio'].play()
		},
		// Handle the conversation after playing the bot's voice
		handleAfterAudio() {
			this.conversation.isWriting = false

			if (this.conversation.hasFinished) {
				// Conversation finished
				this.handleAfterFinish()

				// this.resetConversation()
			} else {
				// Conversation not finished
				// Record the user's voice
				this.conversation.isRecording = true
			}
		},
		// Proceed the conversation after recording
		async proceedConversation() {
			this.conversation.isRecording = false
			this.conversation.isWaiting = true

			// Send the proceed request to the server
			const res = await axios.post(endpoint + '/api/conversation/proceed', {
				convId: this.conversation.id
			})
			this.conversation.success = res.data.success
			this.conversation.hasFinished = res.data.hasFinished

			// Check if the conversation has finished
			if (this.conversation.hasFinished == true) {
				// Conversation Finished
				// Show the order info with notification
				this.conversation.order = res.data.order
			}
			this.conversation.isWaiting = false

			// Play the bot voice from the response
			this.conversation.isWriting = true
			this.$refs['audio'].src = gcsUrl + this.conversation.id + '.wav'
			this.$refs['audio'].play()
		},
		handleAfterFinish() {
			// Open notification
			this.dialogData = this.conversation.order
			this.dialog = true

			this.resetConversation()
		},
		createReceiptScript() {
			const content = {}
			content.title = '주문번호 ' + this.conversation.order.orderNo.toString()

			content.text = `<tr><td>hello</td><td>mirae</td></tr>`

			return content
		},
		async updateConvData(data) {
			this.conversation.success = data.success
			this.conversation.hasFinished = data.hasFinished
			if (data.order) this.conversation.order = data.order
		},
		resetConversation() {
			this.conversation = {
				id: null,
				success: false,
				hasFinished: false,
				isWriting: false,
				isWaiting: false,
				isRecording: false
			}
		}
	}
}
</script>
<style scoped>
h1 {
	font-size: 3rem;
}

.container {
	margin-bottom: 1.5rem;
}

.my-description-text {
	margin: 0.5rem 0;
}

.my-bot-avatar {
	cursor: pointer;
	margin-top: 0.5rem;
}

.my-bot-avatar i {
	font-size: 4rem !important;
}

@media (min-width: 900px) {
	.my-menu-col {
		padding: 0 0.5rem;
	}
}
</style>
<style>
.my-dialog .vs-dialog__content.notFooter {
	margin-bottom: 0;
}
</style>
