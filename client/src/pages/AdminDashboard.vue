<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="9" sm="11" xs="12">
			<h1>{{ storeName }} DASHBOARD</h1>
			<vs-row>
				<vs-col w="6" xs="12" class="my-widget">
					<div class="container">
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
				</vs-col>
				<vs-col w="6" xs="12" class="my-widget">
					<div class="container">
						<vs-row justify="space-between" align="center">
							<h2>메뉴 관리</h2>
							<vs-button shadow icon @click="getMenuGroups"><i class="bx bx-refresh"/></vs-button>
						</vs-row>
						<vs-table class="my-small-card admin-menus-table">
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
						<my-admin-menus
							v-for="menuGroup in menuGroups"
							:key="menuGroup._id"
							:menuGroup="menuGroup"
							class="my-small-card"
							@delete="deleteMenuGroup(menuGroup._id)"
						/>
					</div>
				</vs-col>
			</vs-row>
		</vs-col>
	</vs-row>
</template>

<script>
import axios from 'axios'

import Receipt from '../components/Receipt'
import AdminMenus from '../components/AdminMenus'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myReceipt: Receipt,
		myAdminMenus: AdminMenus
	},
	data: function() {
		return {
			orders: [],
			menuGroups: [],
			newMenuGroupName: ''
		}
	},
	computed: {
		storeName() {
			return this.$store.state.adminUser.storeName
		}
	},
	methods: {
		getOrders() {
			// Get incomplete orders
			axios
				.get(endpoint + '/api/order/store/incomplete', { withCredentials: true })
				.then((res) => {
					this.orders = res.data.reverse()
				})
				.catch((err) => {
					console.error(err)
					alert('주문정보 로딩중 에러가 발생했습니다.')
				})
		},
		getMenuGroups() {
			axios
				.get(endpoint + '/api/menu/group/store', { withCredentials: true })
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
				.post(endpoint + '/api/order/complete', { orderId: orderId }, { withCredentials: true })
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
		deleteOrder(orderId) {
			// Call order delete endpoint
			axios
				.delete(endpoint + '/api/order', { withCredentials: true, params: { orderId: orderId } })
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
	padding: 0 0.5rem 1rem;
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

.my-small-card {
	border: 3px solid rgba(var(--vs-gray-3), 1);
	margin: 1rem 0;
}

.my-receipt {
	padding: 0 1rem;
}

.my-row {
	padding: 10px 12px;
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
