<template>
	<div>
        Admin
		<router-view></router-view>
	</div>
</template>

<script>
import axios from 'axios'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	created() {
		axios.get(endpoint + '/api/user/auth', { withCredentials: true }).then((res) => {
			if (res.data.isAuth) {
				// Logined user
				if (this.$route.path == '/admin') {
					this.$router.push({name: 'AdminDashboard'})
				}
			} else {
				this.$router.replace({name: 'AdminLogin'})
			}
		})
	}
}
</script>
