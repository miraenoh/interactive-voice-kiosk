import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {store} from './store/store'

// Use Vuesax UI framework
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
Vue.use(Vuesax, {
	// Options
})
import './style.css'

// Use vue-cookies module
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false

new Vue({
	router,
	store: store,
	render: (h) => h(App)
}).$mount('#app')
