<template>
	<vs-navbar center-collapsed>
		<template #left>
			<img
				@click="goToMain"
				class="my-logo"
				src="@/assets/app_title.png"
				alt=""
				style="cursor: pointer;"
			/>
		</template>
		<template #right>
			<router-link :to="{ name: 'Customer', params: { id: username } }" target="_blank">
				<vs-button class="my-kiosk-button" flat :active="true">Kiosk</vs-button>
			</router-link>
			<vs-button flat @click="logout">Logout</vs-button>
		</template>
	</vs-navbar>
</template>

<script>
import { logout } from '../utils/auth'

export default {
	computed: {
		username: function() {
			return this.$store.state.adminUser.name
		}
	},
	methods: {
		goToMain() {
			if (this.$route.path != '/admin/dashboard') {
				// Go to the admin main page
				this.$router.replace({ name: 'Admin' })
			}
		},
		logout() {
			// Logout the current user
			logout().catch((err) => {
				alert('에러가 발생했습니다. 다시 시도해주세요.')
			})
		}
	}
}
</script>

<style scoped>
a {
	text-decoration: none;
}

.my-logo {
	height: 2rem;
	margin: 0.5rem;
}
</style>
