<template>
	<div class="receipt-container">
		<h2 class="not-margin">주문번호 {{ conversation.order.orderNo }}</h2>
		<vs-table>
			<template #thead>
				<vs-tr>
					<vs-th>
						메뉴
					</vs-th>
					<vs-th>
						수량
					</vs-th>
					<vs-th>
						가격
					</vs-th>
				</vs-tr>
			</template>
			<template #tbody>
				<vs-tr :key="i" v-for="(menu, i) in conversation.order.menus" :data="menu">
					<vs-td>
						{{ menu.name }}
					</vs-td>
					<vs-td>
						{{ menu.number }}
					</vs-td>
					<vs-td>
						{{ menu.price }}
					</vs-td>
				</vs-tr>
			</template>
		</vs-table>
		<div class="footer-dialog">
			<p>총 주문금액은 {{ conversation.order.totalPrice }}원 입니다.</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		conversation: {
			type: Object
		}
	}
}
</script>

<style>
.receipt-container {
	text-align: center;
	padding: 0.5rem;
}
</style>
