const express = require('express')
const router = express.Router()

const { User } = require('../models/User')
const { auth } = require('../middleware/auth')
const handlerService = require('../services/handlerService')

router.get('/hello', (req, res) => {
	res.send('Hello Frontend!')
})

// Registration endpoint
router.post('/register', (req, res) => {
	// Get info for registration from the client
	const user = new User(req.body)

	// Save info into mongodb
	user.save((err, user) => {
		return handlerService.responseHandler(res, err, user)
	})
})

// Login endpoint
router.post('/login', (req, res) => {
	// Find the username from mongodb
	User.findOne({ name: req.body.name }, (err, user) => {
		if (!user) {
			return res.json({
				success: false,
				message: "There's no user corresponding to the id."
			})
		}

		// Check if the password matches
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) {
				return res.json({
					success: false,
					message: 'Wrong password.'
				})
			}

			// All values are valid
			// Create a tocken for the user
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err)

				// Login success
				// Save the token into cookies and send the response
				res.cookie('x_auth', user.token).status(200).json({
					success: true,
					userId: user._id
				})
			})
		})
	})
})

router.get('/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAuth: true,
		name: req.user.name,
		storeName: req.user.storeName
	})
})

router.get('/logout', auth, (req, res) => {
	req.user.removeToken((err, result) => {
		return handlerService.responseDataHandler(res, err, result)
	})
})

// Get userInfo by username
router.get('/', (req, res) => {
	User.findOne({name: req.query.id}, {_id: 0, name: 1, storeName: 1}, (err, user) => {
		return handlerService.responseDataHandler(res, err, user)
	})
})

module.exports = router
