module.exports = {
    responseHandler: (res, err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err })
        }
        return res.status(200).json({
			success: true
		})
    },
    responseDataHandler: (res, err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err })
        }
        return res.status(200).send(data)
    }
}