let Utility = require('../common/utility')
let { USER_PUBLIC_INFO, COLLECION_FILTER } = require('../controllers/role').permissionDefine

const AdministratorController = {
  /**
   * @param {"category" | "user" | "quest" | "game"} collection
   */
  analytic: collection => {
    let Col = require(`../models/${collection}`)
    return {
      count: async () => ({ count: await Col.countDocuments() }),
      find: async ({ filter, limit, skip }) =>
        await Col.find(
          filter && COLLECION_FILTER[collection]
            ? { ...filter, ...COLLECION_FILTER[collection] }
            : filter || COLLECION_FILTER[collection]
        )
          .limit(Math.min(Number(limit), 100))
          .skip(Number(skip) || 0)
          .select(collection == 'user' ? USER_PUBLIC_INFO : null)
          .exec(),
    }
  },
}

module.exports = AdministratorController
