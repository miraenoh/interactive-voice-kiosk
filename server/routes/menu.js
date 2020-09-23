const express = require('express')
const router = express.Router()

const { Menu } = require('../models/Menu')
const { MenuGroup } = require('../models/MenuGroup')

// Post a menu
router.post('/', (req, res) => {
	const menu = new Menu(req.body)

	// Save info into mongodb
	menu.save((err, menu) => {
		if (err) {
			return res.json({ success: false, err })
		}
		return res.status(200).json({
			success: true
		})
	})
})

// Post a menu group
router.post('/group', (req, res) => {
	const group = new MenuGroup(req.body)

	// Save info into mongodb
	group.save((err, group) => {
		if (err) {
			return res.json({ success: false, err })
		}
		return res.status(200).json({
			success: true
		})
	})
})

module.exports = router
