const express = require('express')
const router = express.Router()

const { Menu } = require('../models/Menu')
const { MenuGroup } = require('../models/MenuGroup')
const handlerService = require('../services/handlerService')

// Post a menu
router.post('/', (req, res) => {
	const menu = new Menu(req.body)

	// Save info into mongodb
	menu.save((err, menu) => {
		return handlerService.responseHandler(res, err, menu)
	})
})

// Post a menu group
router.post('/group', (req, res) => {
	const group = new MenuGroup(req.body)

	// Save info into mongodb
	group.save((err, group) => {
		return handlerService.responseHandler(res, err, group)
	})
})

// Get menu groups corresponding to the userId
router.get('/group/by-user', (req, res) => {
    MenuGroup.find({userId: req.query.userId}, (err, groups) => {
        return handlerService.responseDataHandler(res, err, groups)
    })
})

// Get menus corresponding to the userId
router.get('/by-user', (req, res) => {
    Menu.find({userId: req.query.userId}, (err, menus) => {
        return handlerService.responseDataHandler(res, err, menus)
    })
})

module.exports = router
