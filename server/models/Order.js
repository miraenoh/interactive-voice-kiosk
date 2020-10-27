const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: String,
	orderNo: Number,
	totalPrice: {
		type: Number,
		required: true,
		default: 0
	},
	menus: Array,
	isComplete: {
		type: Boolean,
		required: true,
		default: false
	}
})

const Order = mongoose.model('Order', orderSchema)

module.exports = { Order }
