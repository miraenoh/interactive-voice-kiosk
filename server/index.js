const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')

// Configure bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json
app.use(cookieParser())

// Connect to mongodb
mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('MongoDB Connected')
	})
	.catch((err) => {
		console.log(err)
	})

// Enalbe CORS
app.use(cors({origin: true, credentials: true}))

// Configure routers
app.use('/api/user', require('./routes/user'))
app.use('/api/menu', require('./routes/menu'))
app.use('/api/conversation', require('./routes/conversation'))
app.use('/api/file', require('./routes/file'))
app.use('/api/order', require('./routes/order'))
app.use('/api/explanation', require('./routes/explanation'))

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
