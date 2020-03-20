const cloudinary = require('cloudinary').v2
const { CLOUD_NAME: cloud_name, API_KEY: api_key, API_SECRET: api_secret } = process.env
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

module.exports = {
  upload: async imageBase64 => {
    try {
      let image = cloudinary.uploader.upload(imageBase64)
      return image.url
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
