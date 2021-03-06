<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="9" sm="11" xs="12">
			<!-- Dashboard header -->
			<vs-row align="center">
				<h1>{{ storeName }} DASHBOARD</h1>
				<!-- Open control button -->
				<vs-tooltip class="my-open-button" v-if="!isOpen">
					<vs-button icon flat :active="true" circle success @click="toggleIsOpen">
						<i class="bx bx-play" />
					</vs-button>
					<template #tooltip>
						영업 시작
					</template>
				</vs-tooltip>
				<vs-tooltip class="my-open-button" v-else>
					<vs-button icon flat :active="true" circle danger @click="toggleIsOpen">
						<i class="bx bx-stop" />
					</vs-button>
					<template #tooltip>
						영업 종료
					</template>
				</vs-tooltip>
			</vs-row>
			<vs-row>
				<vs-col w="6" xs="12">
					<!-- Incomplete orders widget -->
					<div class="container my-widget">
						<vs-row justify="space-between" align="center">
							<h2>진행중인 주문</h2>
							<vs-button shadow icon @click="getOrders"><i class="bx bx-refresh"/></vs-button>
						</vs-row>
						<vs-row class="container my-small-card" justify="center" v-if="!orders.length">
							<p>
								진행중인 주문이 없습니다.
							</p>
						</vs-row>
						<div
							v-for="order in orders"
							:key="order._id"
							class="container my-small-card my-receipt"
						>
							<my-receipt :order="order" />
							<vs-row class="my-container-footer" justify="flex-end">
								<vs-button icon @click="completeOrder(order._id)">
									<i class="bx bxs-bell-ring" />준비 완료
								</vs-button>
								<vs-button icon danger @click="deleteOrder(order._id)">
									<i class="bx bxs-trash" />주문 취소
								</vs-button>
							</vs-row>
						</div>
					</div>
					<!-- Complete orders widget -->
					<div class="container my-widget">
						<vs-row justify="space-between" align="center">
							<h2>완료된 주문</h2>
							<div class="my-button-row">
								<vs-tooltip>
									<vs-button icon danger @click="isDialog = true">
										<i class="bx bxs-trash" />
									</vs-button>
									<template #tooltip>
										모두 삭제
									</template>
								</vs-tooltip>
								<vs-button shadow icon @click="getOrders"><i class="bx bx-refresh"/></vs-button>
							</div>
						</vs-row>
						<vs-row class="container my-small-card" justify="center" v-if="!completeOrders.length">
							<p>
								완료된 주문이 없습니다.
							</p>
						</vs-row>
						<div
							v-for="order in completeOrders"
							:key="order._id"
							class="container my-small-card my-receipt"
						>
							<my-receipt :order="order" />
							<vs-row class="my-container-footer" justify="flex-end">
								<vs-button icon warn @click="inCompleteOrder(order._id)">
									<i class="bx bx-up-arrow-alt" />미완료
								</vs-button>
								<vs-button icon danger @click="deleteOrder(order._id)">
									<i class="bx bxs-trash" />주문 삭제
								</vs-button>
							</vs-row>
						</div>
					</div>
				</vs-col>
				<vs-col w="6" xs="12">
					<!-- Menus widget -->
					<div class="container my-widget">
						<vs-row justify="space-between" align="center">
							<h2>메뉴 관리</h2>
							<div class="my-button-row">
								<vs-tooltip>
									<vs-button icon danger gradient @click="createExplanation">
										<i class="bx bxs-user-voice" />
									</vs-button>
									<template #tooltip>
										메뉴설명 음성 업데이트
									</template>
								</vs-tooltip>
								<vs-button shadow icon @click="getMenuGroups"><i class="bx bx-refresh"/></vs-button>
							</div>
						</vs-row>
						<vs-table class="my-small-card menus-table">
							<template #header>
								<vs-row justify="center">
									<h3>카테고리 생성</h3>
								</vs-row>
							</template>
							<template #tbody>
								<vs-row class="my-row" justify="space-between">
									<vs-input v-model="newMenuGroupName" placeholder="카테고리 이름" />
									<vs-button icon circle success @click="addMenuGroup"
										><i class="bx bx-plus"
									/></vs-button>
								</vs-row>
							</template>
						</vs-table>
						<my-menus-table
							v-for="menuGroup in menuGroups"
							:key="menuGroup._id"
							:menuGroup="menuGroup"
							:isAdmin="true"
							class="my-small-card"
							@delete="deleteMenuGroup(menuGroup._id)"
						/>
					</div>
				</vs-col>
			</vs-row>
		</vs-col>
		<!-- Delete all completed orders dialog -->
		<vs-dialog class="admin-dashboard-dialog" v-model="isDialog">
			<template #header>
				<h3>
					완료된 주문을 모두 삭제하시겠어요?
				</h3>
			</template>
			<vs-row justify="center">
				<vs-button danger @click="deleteAllCompleteOrders">
					네, 삭제합니다.
				</vs-button>
			</vs-row>
		</vs-dialog>
	</vs-row>
</template>

<script>
import axios from 'axios'

import Receipt from '../components/Receipt'
import MenusTable from '../components/MenusTable'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myReceipt: Receipt,
		myMenusTable: MenusTable
	},
	data: function() {
		return {
			orders: [],
			completeOrders: [],
			menuGroups: [],
			newMenuGroupName: '',
			isDialog: false
		}
	},
	computed: {
		storeName() {
			return this.$store.state.adminUser.storeName
		},
		isOpen() {
			return this.$store.state.adminUser.isOpen
		}
	},
	methods: {
		getOrders() {
			const errorMessage = '주문정보 로딩중 에러가 발생했습니다.'

			// Get incomplete orders
			axios
				.get(endpoint + '/api/order/store/incomplete', {
					withCredentials: true,
					headers: { x_auth: $cookies.get('x_auth') }
				})
				.then((res) => {
					this.orders = res.data.reverse()
				})
				.catch((err) => {
					console.error(err)
					alert(errorMessage)
				})

			// Get complete orders
			axios
				.get(endpoint + '/api/order/store/complete', {
					withCredentials: true,
					headers: { x_auth: $cookies.get('x_auth') }
				})
				.then((res) => {
					this.completeOrders = res.data.reverse()
				})
				.catch((err) => {
					console.error(err)
					alert(errorMessage)
				})
		},
		getMenuGroups() {
			axios
				.get(endpoint + '/api/menu/group/store', {
					withCredentials: true,
					headers: { x_auth: $cookies.get('x_auth') }
				})
				.then((res) => {
					this.menuGroups = res.data
				})
				.catch((err) => {
					console.error(err)
					alert('메뉴 로딩중 에러가 발생했습니다.')
				})
		},
		completeOrder(orderId) {
			// Call order complete endpoint
			axios
				.post(
					endpoint + '/api/order/complete',
					{ orderId: orderId },
					{ withCredentials: true, headers: { x_auth: $cookies.get('x_auth') } }
				)
				.then((res) => {
					if (res.data.success) {
						this.getOrders()
					} else {
						alert('준비 완료 처리에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('준비 완료 처리중 오류가 발생했습니다.')
				})
		},
		inCompleteOrder(orderId) {
			// Call order incomplete endpoint
			axios
				.post(
					endpoint + '/api/order/incomplete',
					{ orderId: orderId },
					{ withCredentials: true, headers: { x_auth: $cookies.get('x_auth') } }
				)
				.then((res) => {
					if (res.data.success) {
						this.getOrders()
					} else {
						alert('주문 미완료 처리에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('주문 미완료 처리중 오류가 발생했습니다.')
				})
		},
		deleteOrder(orderId) {
			// Call order delete endpoint
			axios
				.delete(endpoint + '/api/order', {
					withCredentials: true,
					headers: { x_auth: $cookies.get('x_auth') },
					params: { orderId: orderId }
				})
				.then((res) => {
					if (res.data.success) {
						this.getOrders()
					} else {
						alert('주문 삭제에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('주문 삭제중 오류가 발생했습니다.')
				})
		},
		deleteAllCompleteOrders() {
			// Call order all complete delete endpoint
			axios
				.delete(endpoint + '/api/order/store/all/complete', {
					withCredentials: true,
					headers: { x_auth: $cookies.get('x_auth') }
				})
				.then((res) => {
					if (res.data.success) {
						this.getOrders()
						this.isDialog = false
					} else {
						alert('모든 완료주문 삭제에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('모든 완료주문 삭제중 오류가 발생했습니다.')
				})
		},
		addMenuGroup() {
			// Check if the input is valid
			if (!this.newMenuGroupName) {
				alert('카테고리 이름을 입력해주세요.')
			} else {
				axios
					.post(endpoint + '/api/menu/group', {
						name: this.newMenuGroupName,
						userId: this.$store.state.adminUser.name
					})
					.then((res) => {
						if (res.data.success) {
							alert(this.newMenuGroupName + ' 카테고리를 생성했습니다.')
							this.newMenuGroupName = ''
							this.getMenuGroups()
						} else {
							alert('카테고리 생성에 실패했습니다.')
						}
					})
					.catch((err) => {
						console.error(err)
						alert('카테고리 생성중 오류가 발생했습니다.')
					})
			}
		},
		deleteMenuGroup(groupId) {
			axios
				.delete(endpoint + '/api/menu/group', { params: { groupId: groupId } })
				.then((res) => {
					if (res.data.success) {
						this.getMenuGroups()
					} else {
						alert('카테고리 삭제에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('카테고리 삭제중 오류가 발생했습니다.')
				})
		},
		createExplanation() {
			const loading = this.$vs.loading()
			axios
				.post(
					endpoint + '/api/explanation',
					{},
					{ withCredentials: true, headers: { x_auth: $cookies.get('x_auth') } }
				)
				.then((res) => {
					loading.close()

					if (res.data.success) {
						alert('음성 업데이트 성공')
					} else {
						alert('메뉴설명 음성 업데이트에 실패했습니다.')
					}
				})
				.catch((err) => {
					loading.close()
					console.error(err)
					alert('메뉴설명 음성 업데이트중 오류가 발생했습니다.')
				})
		},
		toggleIsOpen() {
			axios
				.post(
					endpoint + '/api/user/isopen',
					{},
					{ withCredentials: true, headers: { x_auth: $cookies.get('x_auth') } }
				)
				.then((res) => {
					this.$store.state.adminUser.isOpen = res.data.isOpen
				})
				.catch((err) => {
					console.error(err)
					alert('오픈여부 변경중 오류가 발생했습니다.')
				})
		}
	},
	created() {
		this.getOrders()
		this.getMenuGroups()
	}
}
</script>

<style scoped>
.my-page {
	margin-top: 3rem;
}

.my-widget {
	margin: 0 0.5rem 1rem;
	/* padding: 1rem 0 0.5rem; */
}

.my-widget h2 {
	margin: 0 0 0 0.5rem;
}

.my-container-footer {
	margin-bottom: 0.5rem;
}

.my-container-footer i {
	margin-right: 0.2rem;
}

.my-receipt {
	padding: 0 1rem;
}

.my-row {
	padding: 10px 12px;
}

.my-button-row {
	display: flex;
	flex-direction: row;
}

.my-open-button {
	margin-left: 1rem;
}

@media (max-width: 900px) {
	.my-small-card {
		padding: 0;
	}
	.my-container-footer {
		padding-right: 0.5rem;
	}
}

h1 {
	padding-left: 1rem;
}

h3 {
	margin: 0.5rem 0;
}
</style>

<style>
.admin-dashboard-dialog .vs-dialog__header {
	margin-top: 20px;
}
</style>
