const express = require('express')
const multer = require('multer')
const router = express.Router()

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'temp')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

let upload = multer({
	storage: storage
})

router.post('/upload', upload.any(), async (req, res) => {
	// The 'user-voice.wav' file is stored now
	// Save the file into GCS

	res.status(200).send({ success: true })
})

module.exports = router
