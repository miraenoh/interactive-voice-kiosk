<template>
	<div class="center">
		<div class="my-padding"></div>
		<img src="@/assets/app_title.png" />
		<div class="grid">
			<vs-row justify="center">
				<vs-col w="4" sm="8" xs="11" class="container login-form-container">
					<vs-input @keyup.enter="login" v-model="username" placeholder="아이디">
						<template #icon>
							<i class="bx bx-user" />
						</template>
					</vs-input>
					<vs-input @keyup.enter="login" type="password" v-model="password" placeholder="비밀번호">
						<template #icon>
							<i class="bx bx-lock" />
						</template>
					</vs-input>
					<vs-button @click="login" class="my-login-button" block flat :active="true">
						로그인
					</vs-button>
					<vs-row class="my-new-account" justify="flex-end">
						<p @click="isSignupDialog = true">관리자 계정 생성</p>
					</vs-row>
				</vs-col>
			</vs-row>
		</div>
		<vs-dialog prevent-close v-model="isSignupDialog">
			<my-sign-up @signUpDone="signUpDoneHandler" />
		</vs-dialog>
	</div>
</template>

<script>
import axios from 'axios'

import SignUp from '../components/SignUp'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	components: {
		mySignUp: SignUp
	},
	data: function() {
		return {
			username: '',
			password: '',
			isSignupDialog: false
		}
	},
	methods: {
		login() {
			axios
				.post(endpoint + '/api/user/login', { name: this.username, password: this.password })
				.then((res) => {
					if (res.data.success) {
						// 로그인 성공
						$cookies.set('x_auth', res.data.x_auth)
						alert('로그인 성공')
						this.$router.replace({ name: 'Admin' })
					} else {
						// 로그인 실패
						alert(res.data.message)
						// 폼 데이터 초기화
						this.username = ''
						this.password = ''
					}
				})
				.catch((err) => {
					alert('오류가 발생했습니다. 다시 시도해주세요.')
				})
		},
		signUpDoneHandler() {
			this.isSignupDialog = false
		}
	}
}
</script>

<style scoped>
.my-padding {
	height: 10em;
}

.my-login-button {
	height: 2.5rem;
}

.my-new-account p {
	margin: 10px 0;
	font-size: 0.8rem;
	color: rgba(var(--vs-text), 0.5);
	cursor: pointer;
}
</style>

<style>
.login-form-container .vs-input-content {
	margin: 10px 0;
	width: calc(100%);
}

.login-form-container .vs-input-content .vs-input {
	width: 100%;
}

.login-form-container input {
	height: 2.5rem;
}
</style>
