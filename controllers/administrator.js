let Utility = require('../common/utility')
let { USER_PUBLIC_INFO, COLLECION_FILTER } = require('../controllers/role').permissionDefine
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
          .select(collection == 'user' ? USER_PUBLIC_INFO : null)
          .exec()
      },
      findOne: async ({ filter }) =>
        await Col.findOne(
          filter && COLLECION_FILTER[collection]
            ? { ...filter, ...COLLECION_FILTER[collection] }
            : filter || COLLECION_FILTER[collection]
        )
          .select(collection == 'user' ? USER_PUBLIC_INFO : null)
          .exec(),
    }
  },
}

module.exports = AdministratorController
