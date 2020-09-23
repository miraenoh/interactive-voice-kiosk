const express = require('express')
const router = express.Router()

const conversationService = require('../services/conversationService')

// Start the conversation with bot
router.get('/start', (req, res) => {
    const userId = req.query.userId
    conversationService.start(userId).then((result) => {
        return res.status(200).json({success: result})
    })
})

module.exports = router