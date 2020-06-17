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
    filter = filter ? { ...filter, deleted: false } : { deleted: false }
    let categories = await Category.find(filter).exec()
    return categories
  },
  /**
   * TODO: Get categories
   * @param {any} filter
   * @param {Function} callback
   */
  getById: async id => {
    let categories = await Category.findById(id).exec()
    return categories
  },
  /**
   * TODO: Update category
   * @param {Category} category
   */
  update: async category => {
    try {
      let _category = await Category.findById(category._id).exec()
      let res = await _category.set(category).save()
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
