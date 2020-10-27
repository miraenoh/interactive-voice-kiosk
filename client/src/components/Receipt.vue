<template>
	<div class="receipt-container">
		<h3 class="not-margin">주문번호 {{ order.orderNo }}</h3>
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
				<vs-tr :key="i" v-for="(menu, i) in order.menus" :data="menu">
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
			<p>총 주문금액 {{ order.totalPrice }}원</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		order: {
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

.receipt-container tr {
	text-align: left;
}

.receipt-container .vs-table {
	/* border-width: 3px; */
	/* border-style: solid; */
	/* border-color: rgba(var(--vs-gray-3), 1); */
}
</style>
