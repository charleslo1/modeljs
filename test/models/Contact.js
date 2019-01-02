const Model = require('../../dist/modeljs')

/**
 * 联系方式模型
 * @type {Contact}
 */
const Contact = Model.define('Contact', {
  // id
  id: {
    type: Number,
    default: 0
  },

  // 类型（字符串类型）
  type: {
    type: String,
    field: 'lei_xin',
    default: '手机'
  },

  // 号码（字符串类型）
  number: {
    type: String,
    field: 'hao_ma',
    default: ''
  }
})

module.exports = Contact
