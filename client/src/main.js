import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Use Vuesax UI framework
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
Vue.use(Vuesax, {
	// Options
})
import './style.css'

Vue.config.productionTip = false

console.log(process.env.VUE_APP_SERVER_DOMAIN)

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')
