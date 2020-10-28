const mongoose = require('mongoose')

const CONV_EXP_SECS = require('../constants').CONV_EXP_SECS

const conversationSchema = mongoose.Schema({
	userId: String,
	state: String,
	expTime: Number
})

// Preprocessor for save action
conversationSchema.pre('save', function (next) {
	let conversation = this
	// Set the expTime for the conversation
	conversation.expTime = Math.floor(new Date().getTime() / 1000) + CONV_EXP_SECS

	next()
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = { Conversation }
