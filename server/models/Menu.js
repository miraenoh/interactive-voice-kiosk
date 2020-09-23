const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
	name: {
		type: String,
		maxLength: 50,
		required: true
    },
    price: {
        type: Number,
        required: true
    },
	userId: String,
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
})

const Menu = mongoose.model('Menu', menuSchema)

module.exports = { Menu }
