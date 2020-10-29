import axios from 'axios'

import { store } from '../store/store'
import router from '../router'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export async function getAuth() {
	try {
		const res = await axios.get(endpoint + '/api/user/auth', { withCredentials: true })
		console.log(res.data)
		store.state.adminUser.id = res.data.userId
		store.state.adminUser.name = res.data.name
		store.state.adminUser.storeName = res.data.storeName
		store.state.adminUser.isOpen = res.data.isOpen
		return res.data
	} catch (err) {
		console.error(err)
		throw err
	}
}

export async function login(username, password) {
	try {
		const res = await axios.post(endpoint + '/api/user/login', {
			name: username,
			password: password
		})

		if (res.data.success) {
			// Login success
			$cookies.set('x_auth', res.data.x_auth)
			store.state.adminUser.id = res.data.userId
			store.state.adminUser.name = res.data.name
			store.state.adminUser.storeName = res.data.storeName
			store.state.adminUser.isOpen = res.data.isOpen

			return { success: true }
		} else {
			// Login fail
			return { success: false, message: res.data.message }
		}
	} catch (err) {
		console.error(err)
		throw err
	}
}

export async function logout() {
	try {
		const res = await axios.get(endpoint + '/api/user/logout', { withCredentials: true })

		if (res.data.success) {
			$cookies.remove('x_auth')
			router.replace({name: 'AdminLogin'})
		} else {
			alert('로그아웃 실패')
		}
	} catch (err) {
		console.error(err)
		throw err
	}
}

export async function signUp(username, password, storename) {
	try {
		const res = await axios.post(endpoint + '/api/user/register', {
			name: username,
			password: password,
			storeName: storename
		})

		if (res.data.success) {
			return { success: true }
		} else {
			return { success: false, message: res.data.message }
		}
	} catch (err) {
		console.error(err)
		throw err
	}
}
