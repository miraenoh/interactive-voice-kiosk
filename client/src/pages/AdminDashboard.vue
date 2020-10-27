<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="9" sm="11">
			<h1>{{ storeName }} DASHBOARD</h1>
			<vs-row>
				<vs-col w="6" xs="12" class="my-widget">
					<div class="container">
						<vs-row justify="space-between" align="center">
							<h2>진행중인 주문</h2>
							<vs-button shadow icon @click="getOrders"><i class="bx bx-refresh" /></vs-button>
						</vs-row>
						<div v-for="order in orders" :key="order._id" class="container my-receipt">
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
						<h2>메뉴 관리</h2>
					</div>
				</vs-col>
			</vs-row>
		</vs-col>
	</vs-row>
</template>

<script>
import axios from 'axios'

import Receipt from '../components/Receipt'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myReceipt: Receipt
	},
	data: function() {
		return {
			orders: []
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
		}
	},
	created() {
		this.getOrders()
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

.my-receipt {
	border: 3px solid rgba(var(--vs-gray-3), 1);
	margin: 1rem 0;
	padding: 0 1rem;
}

@media (max-width: 900px) {
	.my-receipt {
		padding: 0;
	}
	.my-container-footer {
		padding-right: 0.5rem;
	}
}

h1 {
	padding-left: 1rem;
}
</style>
