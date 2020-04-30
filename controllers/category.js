const Category = require('../models/category')
let Utility = require('../common/utility')

const CategoryController = {
  /**
   * TODO: Create category
   * @param {String} description
   * @param {String} img_path
   * @param {String} name
   */
  create: async ({ name, description, img_path }) => {
    let newCategory = new Category({
      name,
      description,
      img_path,
      tag: [],
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
    filter = filter ? { ...filter, delete: false } : { delete: false }
    let categories = await Category.find(filter).exec()
    return categories
  },
  /**
   * TODO: Update category
   * @param {Category} category
   */
  update: async category => {
    let _category = await Category.findById(category._id).exec()
    _category = { ..._category, ...category }
    try {
      let res = await _category.save()
      return res
    } catch (error) {
      throw error
    }
  },
  /**
   * TODO: Update category
   * @param {string} _id categoryId
   */
  delete: async _id => {
    try {
      let category = await Category.findById(_id).exec()
      category.deleted = true
      let res = await category.save()
      return res
    } catch (error) {
      throw error
    }
  },
}

module.exports = CategoryController
