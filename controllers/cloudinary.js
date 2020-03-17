const cloudinary = require('cloudinary').v2
const { CLOUD_NAME: cloud_name, API_KEY: api_key, API_SECRET: api_secret } = process.env
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

module.exports = {
  upload: (imageBase64, callback) => {
    cloudinary.uploader.upload(imageBase64, (err, image) => {
      if (err) {
        console.log(err)
        return callback(err, null)
      } else {
        return callback(null, image.url)
      }
    })
  },
}
