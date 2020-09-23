const express = require('express')
const router = express.Router()

const { Conversation } = require('../models/Conversation')
const conversationService = require('../services/conversationService')

// Start the conversation with the bot
router.get('/start', (req, res) => {
	// Create a new conversation data
	const conversation = new Conversation({ userId: req.query.userId, state: 'started' })

	// Save the conversation into mongodb
	// And call conversationService to start
	conversation.save((err, conversation) => {
        if (err) return res.status(400).json({ success: false, err })
		conversationService.start(conversation).then((result) => {
			return res.status(200).json({ id: conversation._id, success: result, hasFinished: false })
		})
	})
})

// Proceed the conversation with the bot
router.post('/proceed', (req, res) => {
	// Load the requested conversation
    const convId = req.body.convId
	Conversation.findOne({_id: convId}, (err, conversation) => {
        if (err) return res.status(400).json({ id: convId, success: false, err })

		switch (conversation.state) {
			case 'started':
                // The conversation started
				// Get user's orer and make the order info
                conversationService.processOrder(conversation, (result) => {
                    return res.status(400).send(result)
                })
				break
			default:
				return res
					.status(200)
					.json({ id: conversation._id, success: false, message: 'Invalid conversation status.' })
		}
	})
})

module.exports = router
