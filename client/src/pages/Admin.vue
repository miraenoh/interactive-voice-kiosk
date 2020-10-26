<template>
	<div>
		<my-navbar></my-navbar>
		<router-view></router-view>
	</div>
</template>

<script>
import Navbar from '../components/Navbar'
import { getAuth } from '../utils/auth'

export default {
	components: {
		myNavbar: Navbar
	},
	created() {
		getAuth()
			.then((res) => {
				if (res.isAuth) {
					// Logined user
					// Save the adminUser data into the state if not exists
					if (!this.$store.state.adminUser.id) {
						this.$store.state.adminUser.id = res.userId
						this.$store.state.adminUser.storeName = res.storeName
					}
					// Go to the main page(dashboard)
					if (this.$route.path == '/admin') {
						this.$router.push({ name: 'AdminDashboard' })
					}
				} else {
					this.$router.replace({ name: 'AdminLogin' })
				}
			})
			.catch((err) => {
				this.$router.replace({ name: 'AdminLogin' })
			})
	}
}
</script>
