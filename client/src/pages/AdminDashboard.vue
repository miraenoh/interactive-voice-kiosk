<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="9" xs="11">
			<h1>{{ storeName }} DASHBOARD</h1>
			<vs-row>
				<vs-col w="6" xs="12" class="my-widget" style="background-color: red;">ORDERS</vs-col>
				<vs-col w="6" xs="12" class="my-widget" style="background-color: lightgrey;">MENUS</vs-col>
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
  created() {
  }
}
</script>

<style scoped>
.my-page {
	margin-top: 3rem;
}
.my-widget {
	padding: 1rem;
}
</style>
