const express = require('express')
const router = express.Router()

const { Menu } = require('../models/Menu')
const { MenuGroup } = require('../models/MenuGroup')
const { auth } = require('../middleware/auth')
const handlerService = require('../services/handlerService')

// Get menu groups corresponding to the userId
router.get('/group/by-user', (req, res) => {
	MenuGroup.find({ userId: req.query.userId }, (err, groups) => {
		return handlerService.responseDataHandler(res, err, groups)
	})
})

// Get menu groups corresponding to the store
router.get('/group/store', auth, (req, res) => {
	MenuGroup.find({ userId: req.user.name }, (err, groups) => {
		return handlerService.responseDataHandler(res, err, groups)
	})
})

// Get menus corresponding to the userId
router.get('/by-user', (req, res) => {
	Menu.find({ userId: req.query.userId }, (err, menus) => {
		return handlerService.responseDataHandler(res, err, menus)
	})
})

// Get menus corresponding to the menuGroup
router.get('/by-group', (req, res) => {
	Menu.find({ groupId: req.query.groupId }, (err, menus) => {
		return handlerService.responseDataHandler(res, err, menus)
	})
})

// Post a menu
router.post('', (req, res) => {
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

// Delete a menu
router.delete('', (req, res) => {
	Menu.deleteOne({ _id: req.query.menuId }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

// Delete a menu group
router.delete('/group', (req, res) => {
	MenuGroup.deleteOne({ _id: req.query.groupId }, (err) => {
		return handlerService.responseHandler(res, err)
	})
})

module.exports = router
