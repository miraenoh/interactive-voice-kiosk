const express = require('express')
const router = express.Router()

const { Order } = require('../models/Order')
const { auth } = require('../middleware/auth')
const handlerService = require('../services/handlerService')

// Response with orders corresponding to the logined store
router.get('/store/all', auth, (req, res) => {
	Order.find({ userId: req.user.name }, (err, orders) => {
		return handlerService.responseDataHandler(res, err, orders)
	})
})

// Response with not completed orders corresponding to the logined store
router.get('/store/incomplete', auth, (req, res) => {
	Order.find({userId: req.user.name, isComplete: false}, (err, orders) => {
		return handlerService.responseDataHandler(res, err, orders)
	})
})

// Delete all orders corresponding to the logined store
router.delete('/store/all', auth, (req, res) => {
	Order.deleteMany({ userId: req.user.name }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

module.exports = router
