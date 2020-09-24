const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
	userId: String,
	state: String
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = { Conversation }
