const Category = require('../models/category')
let Utility = require('../common/utility')

const category = {
  /**
   * TODO: Create collection
   * @param {String} description
   * @param {String} img_path
   * @param {String} name
   * @param {String} tag
   * @param {Function} callback
   */
  create: async (name, description, img_path, tag) => {
    let newCategory = new Category({
      name,
      description,
      img_path,
      tag,
      deleted: false,
    })
    try {
      let res = await newCategory.save()
      return res
    } catch (error) {
      throw error
    }
  },
  /**
   * TODO: Get categories
   * @param {any} filter
   * @param {Function} callback
   */
  get: async filter => {
    let categories = await Category.find(filter || {}).exec()
    return categories
  },
  /**
   * TODO: Update category
   * @param {Category} newCategory
   */
  updateInfo: async newCategory => {
    let category = await Category.findById(newCategory._id).exec()
    category._id = newCategory._id
    category.description = newCategory.description
    category.img_path = newCategory.img_path
    category.name = newCategory.name
    category.tag = newCategory.tag
    try {
      let res = await category.save()
      return res
    } catch (error) {
      throw error
    }
  },
}

module.exports = category
