let Utility = require('../common/utility')
let { COLLECION_FILTER } = require('../controllers/role').permissionDefine
let Role = require('./role')

const AdministratorController = {
  /**
   * @param {"category" | "user" | "quest" | "game"} collection
   */
  analytic: collection => {
    let Col = require(`../models/${collection}`)
    return {
      count: async ({ filter }) => ({ count: await Col.where(filter || {}).countDocuments() }),
      find: async ({ filter, limit, skip }) => {
        return await Col.find(
          filter && COLLECION_FILTER[collection]
            ? { ...filter, ...COLLECION_FILTER[collection] }
            : filter || COLLECION_FILTER[collection]
        )
          .limit(Math.min(Number(limit), 100))
          .skip(Number(skip) || 0)
          .select(getPublicFields(collection))
          .exec()
      },
      findOne: async ({ filter }) =>
        await Col.findOne(
          filter && COLLECION_FILTER[collection]
            ? { ...filter, ...COLLECION_FILTER[collection] }
            : filter || COLLECION_FILTER[collection]
        )
          .select(getPublicFields(collection))
          .exec(),
    }
  },
}

const getPublicFields = collection => {
  return require('../controllers/role').permissionDefine[`${collection.toUpperCase()}_PUBLIC_INFO`]
}
module.exports = AdministratorController
