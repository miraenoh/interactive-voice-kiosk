const express = require('express')
const router = express.Router()

const { auth } = require('../middleware/auth')
const explanationService = require('../services/explanationService')
const handlerService = require('../services/handlerService')

router.post('', auth, (req, res) => {
	explanationService.updateExplanation(req.user).then((success) => {
		return handlerService.responseHandler(res, undefined, { success: success })
	})
})

module.exports = router
