let Utility = require('../common/utility')

const AdministratorController = {
  /**
   * @param {"category" | "user" | "quest"} collection
   */
  analytic: collection => {
    let Col = require(`../models/${collection}`)
    return {
      count: async () => await Col.countDocuments(),
      find: async filter => await Col.find(filter),
    }
  },
}

module.exports = AdministratorController
