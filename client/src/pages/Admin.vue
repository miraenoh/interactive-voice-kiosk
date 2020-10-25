<template>
	<div>
		<my-navbar></my-navbar>
		<router-view></router-view>
	</div>
</template>

<script>
import axios from 'axios'

import Navbar from '../components/Navbar'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		myNavbar: Navbar
	},
	created() {
		axios.get(endpoint + '/api/user/auth', { withCredentials: true }).then((res) => {
			if (res.data.isAuth) {
				// Logined user
				if (this.$route.path == '/admin') {
					this.$router.push({ name: 'AdminDashboard' })
				}
			} else {
				this.$router.replace({ name: 'AdminLogin' })
			}
		})
	}
}
</script>
