const mongoose = require('mongoose')

const explanationSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true
	},
	transcript: {
		type: String,
		required: true,
		default: ''
	}
})

const Explanation = mongoose.model('Explanation', explanationSchema)

module.exports = { Explanation }
