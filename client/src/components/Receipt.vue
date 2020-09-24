<template>
	<vs-dialog v-model="myDialog">
		<template #header>
			<h2 class="not-margin">주문번호 {{ conversation.order.orderNo }}</h2>
		</template>
		<div>
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
		</div>
		<template #footer>
			<div class="footer-dialog">
				<p>총 주문금액은 {{ conversation.order.totalPrice }}원 입니다.</p>
			</div>
		</template>
	</vs-dialog>
</template>

<script>
export default {
	props: {
		dialog: Boolean,
		conversation: {
			type: Object
		}
    },
    data: function() {
        return {
            myDialog: this.dialog
        }
    }
}
</script>

<style>
.vs-dialog tbody tr {
	background-color: #fcfcfc;
}
h2.not-margin {
	margin-top: 0.7rem;
	margin-bottom: 0;
}
.footer-dialog {
	text-align: center;
}
</style>
