const cloudinary = require('cloudinary').v2
const { CLOUD_NAME: cloud_name, API_KEY: api_key, API_SECRET: api_secret } = process.env
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

module.exports = {
  /**
   * TODO: Upload imgage and return url path
   * @returns {Promise<string>} url path
   */
  upload: async imageBase64 => {
    try {
      let image = await cloudinary.uploader.upload(imageBase64)
      console.log(`==================[uploaded image to server]============== [${image.url}]`)
      return image.url
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
