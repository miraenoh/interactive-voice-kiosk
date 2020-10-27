<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="9" xs="11">
			<h1>{{ storeName }} DASHBOARD</h1>
			<vs-row>
				<vs-col w="6" xs="12" class="my-widget">
					<div class="container">
						<h2>주문 관리</h2>
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
export default {
	computed: {
		storeName() {
			return this.$store.state.adminUser.storeName
		}
	},
	created() {}
}
</script>

<style scoped>
.my-page {
	margin-top: 3rem;
}

.my-widget {
	padding: 0.5rem;
}

h1 {
	padding-left: 1rem;
}

h2 {
	margin: 0;
}
</style>
