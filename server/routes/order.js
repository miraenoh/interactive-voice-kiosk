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
	Order.find({ userId: req.user.name, isComplete: false }, (err, orders) => {
		return handlerService.responseDataHandler(res, err, orders)
	})
})

// Response with completed orders corresponding to the logined store
router.get('/store/complete', auth, (req, res) => {
	Order.find({ userId: req.user.name, isComplete: true }, (err, orders) => {
		return handlerService.responseDataHandler(res, err, orders)
	})
})

// Set an order as complete
router.post('/complete', auth, (req, res) => {
	Order.updateOne({ _id: req.body.orderId }, { isComplete: true }, (err, order) => {
		return handlerService.responseHandler(res, err, order)
	})
})

// Set an order as incomplete
router.post('/incomplete', auth, (req, res) => {
	Order.updateOne({ _id: req.body.orderId }, { isComplete: false }, (err, order) => {
		return handlerService.responseHandler(res, err, order)
	})
})

// Delete all orders corresponding to the logined store
router.delete('/store/all', auth, (req, res) => {
	Order.deleteMany({ userId: req.user.name }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

// Delete all complete orders corresponding to the logined store
router.delete('/store/all/complete', auth, (req, res) => {
	Order.deleteMany({ userId: req.user.name, isComplete: true }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

// Delete an order
router.delete('', auth, (req, res) => {
	Order.deleteOne({ _id: req.query.orderId }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

module.exports = router
