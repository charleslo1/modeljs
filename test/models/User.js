const Model = require('../../dist/modeljs')
const Company = require('./Company')
const Contact = require('./Contact')

/**
 * 用户模型
 * @type {User}
 */
const User = Model.define('User', {
  // id（数字类型）
  id: {
    type: Number,
    default: 0
  },

  // 姓名（字符串类型）
  name: {
    type: String,
    field: 'xing_ming',
    default: 'name'
  },

  // 生日（日期类型）
  brithday: {
    type: Date,
    field: 'sheng_ri'
  },

  // 公司（自定义类型）
  company: {
    type: Company,
    field: 'gong_si'
  },

  // 联系方式（自定义集合类型）
  contacts: {
    type: Array(Contact),
    field: 'lian_xi_fang_shi',
    default: () => []
  }
})

module.exports = User
