const express = require('express')
const router = express.Router()

const { Conversation } = require('../models/Conversation')
const conversationService = require('../services/conversationService')

// Start the conversation with the bot
router.get('/start', (req, res) => {
	// Create a new conversation data
    const conversation = new Conversation({ userId: req.query.userId, state: 'success' })
    
    // Save the conversation into mongodb
    // And call conversationService to start
    conversation.save((err, conversation) => {
        if (err) return res.status(400).json({ success: false, err })

        conversationService.start(conversation._id).then((result) => {
            return res.status(200).json({ id: conversation._id, success: result, hasFinished: false })
        })
    })
})

// Proceed the conversation with the bot
router.post('/conversation', (req, res) => {
	return res.send('Hello')
})

module.exports = router
