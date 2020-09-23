const mongoose = require('mongoose')

const menuGroupSchema = mongoose.Schema({
	name: {
		type: String,
		maxLength: 50,
		required: true
	},
	userId: String
})

const MenuGroup = mongoose.model('MenuGroup', menuGroupSchema)

module.exports = { MenuGroup }
