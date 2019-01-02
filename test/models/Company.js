const Model = require('../../dist/modeljs')

/**
 * 公司模型
 * @type {Company}
 */
const Company = Model.define('Company', {
  // id（数字类型）
  id: {
    type: Number,
    default: 0
  },

  // 公司名称（字符串类型）
  name: {
    type: String,
    field: 'ming_cheng',
    default: 'Company Name'
  },

  // 地址（字符串类型）
  address: {
    type: String,
    field: 'di_zhi',
    default: 'Company Address'
  }
})

module.exports = Company
