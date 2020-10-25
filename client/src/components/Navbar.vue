<template>
	<vs-navbar center-collapsed>
		<template #left>
			<img @click="goToMain" class="my-logo" src="@/assets/app_title.png" alt="" />
		</template>
		<template #right>
			<vs-button flat @click="logout">Logout</vs-button>
		</template>
	</vs-navbar>
</template>

<script>
import axios from 'axios'

export default {
	methods: {
		goToMain() {
			if (this.$route.path == '/admin/dashboard') {
				// Refresh
				location.reload()
			} else {
				// Go to the admin main page
				this.$router.replace({ name: 'Admin' })
			}
		},
		logout() {
			// Logout the current user
			axios
				.get(process.env.VUE_APP_API_ENDPOINT + '/api/user/logout', { withCredentials: true })
				.then((res) => {
					if (res.data.success) {
						$cookies.remove('x_auth')
						location.reload()
					} else {
						alert('로그아웃 실패')
					}
				})
				.catch((err) => {
					alert('에러가 발생했습니다. 다시 시도해주세요.')
				})
		}
	}
}
</script>

<style scoped>
.my-logo {
	height: 2rem;
	padding: 0.5rem;
}
</style>
