const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const uploadFile = async (bucketName, filePath) => {
	await storage.bucket(bucketName).upload(filePath, {
		gzip: true,
		metadata: {
			cacheControl: 'no-cache'
		}
	})

	return true
}

// Check if the given file exists and return boolean
const fileExists = async (bucketName, fileName) => {
    const file = storage.bucket(bucketName).file(fileName)
    const res = await file.exists()
    const exists = res[0]

    return exists
}

module.exports = {
    uploadFile: uploadFile,
    fileExists: fileExists
}
