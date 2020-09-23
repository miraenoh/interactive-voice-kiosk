module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: process.env.VUE_APP_SERVER_DOMAIN,
				changeOrigin: true
			}
		}
	}
}
