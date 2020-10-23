<template>
	<div class="grid">
		<audio ref="audio" @ended="handleAfterAudio"></audio>
		<vs-row justify="center">
			<vs-col lg="6" sm="9" xs="11">
				<h1 class="center">
					{{ user.storeName }}
				</h1>
				<vs-row>
					<vs-col w="12">
						<div class="container">
							<vs-table v-if="user">
								<template #thead>
									<vs-tr>
										<vs-th>
											메뉴판
										</vs-th>
										<vs-th> </vs-th>
									</vs-tr>
								</template>
								<template #tbody>
									<vs-tr>
										<vs-td>메뉴를 고른 뒤 버튼을 눌러 주문하세요.</vs-td>
										<vs-td> </vs-td>
									</vs-tr>
									<vs-tr v-for="menu in menuViews" :key="menu.id" :class="menu.class">
										<vs-td>
											{{ menu.name }}
										</vs-td>
										<vs-td class="right">
											{{ menu.price }}
										</vs-td>
									</vs-tr>
								</template>
							</vs-table>
							<p v-else>존재하지 않는 가게입니다.</p>
						</div>
						<div class="bottom-intent"></div>
					</vs-col>
				</vs-row>
			</vs-col>
		</vs-row>
		<my-receipt v-if="dialog" :dialog="dialog" :conversation="dialogData" />
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

import Recorder from '../components/Recorder'
import Receipt from '../components/Receipt'

const gcsUrl = 'https://storage.googleapis.com/voice-bot/'
const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myRecorder: Recorder,
		myReceipt: Receipt
	},
	props: ['id'],
	data: function() {
		return {
			user: {},
			menus: [],
			menuGroups: [],
			menuViews: [],
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

		// Get all menus and menuGroups by userId
		res = await axios.get(endpoint + '/api/menu/by-user', { params: { userId: this.id } })
		this.menus = res.data
		res = await axios.get(endpoint + '/api/menu/group/by-user', { params: { userId: this.id } })
		this.menuGroups = res.data

		this.createMenuView()

		loading.close()
	},
	methods: {
		createMenuView() {
			let group, menu
			for (group of this.menuGroups) {
				group.class = 'my-header'
				this.menuViews.push(group)
				for (menu of this.menus) {
					if (menu.groupId === group._id) {
						this.menuViews.push(menu)
					}
				}
			}
		},
		async handleClick() {
			if (!this.conversation.id) {
				this.startConversation()
			}
		},
		async startConversation() {
			// Start a conversation with the bot
			this.conversation.isWaiting = true
			console.log('Start conversation')
			// Send the start request to the server
			const res = await axios.get(endpoint + '/api/conversation/start', { params: { userId: this.id } })
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
			const res = await axios.post(endpoint + '/api/conversation/proceed', { convId: this.conversation.id })
			console.log('got response')
			console.log(res.data)
			this.conversation.success = res.data.success
			this.conversation.hasFinished = res.data.hasFinished

			// Check if the conversation has finished
			if (this.conversation.hasFinished == true) {
				// Conversation Finished
				// Show the order info with notification
				console.log('FINISHED')
				this.conversation.order = res.data.order
				console.log(this.conversation.order)
			}
			this.conversation.isWaiting = false

			// Play the bot voice from the response
			this.conversation.isWriting = true
			this.$refs['audio'].src = gcsUrl + this.conversation.id + '.wav'
			this.$refs['audio'].play()
		},
		handleAfterFinish() {
			// Open notification
			this.dialogData = this.conversation
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
		},
		playAudio() {}
	}
}
</script>
<style scoped>
h1,
h2 {
	font-family: 'Jua';
	font-weight: normal;
}
h1 {
	font-size: 3rem;
}
.my-bot-avatar {
	cursor: pointer;
	margin-top: 0.5rem;
}
.my-bot-avatar i {
	font-size: 4rem !important;
}
.my-header {
	background-color: rgba(var(--vs-gray-2), 1);
	font-weight: bold;
}
div.bottom-intent {
	height: 100px;
}
</style>
