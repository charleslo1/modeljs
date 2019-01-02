global.wx = {
  setStorageSync: () => {},
  getStorageSync: () => {},
  request: () => {}
}
const assert = require('assert')

// Model
const Model = require('../dist/modeljs')
// 定义的模型
const User = require('./models/User')
const Company = require('./models/Company')
const Contact = require('./models/Contact')

// 测试 modeljs.js
describe('modeljs.js', () => {

  it('Model.define(props)', () => {
    var user = new User({ id: 100, name: 'Charles Lo'})
    assert.equal('Charles Lo', user.name)
  })

  it('Model.create(values)', () => {
    var obj = {
      id: 100,
      name: 'Charles Lo',
      brithday: '1991-12-26',
      company: {
        name: '深圳市腾讯计算机系统有限公司',
        address: '深圳市南山区腾讯大厦'
      },
      contacts: [{
        type: '手机号',
        number: '18666666666'
      }, {
        type: '微信号',
        number: 'wx199111111'
      }, {
        type: '邮箱',
        number: 'wx199111111@qq.com'
      }]
    }
    var user1 = new User(obj)
    var user2 = User.create(obj)

    assert.equal(user1.name, user2.name)
    assert.notEqual(user1, user2)
    assert.notEqual(user1.brithday, user2.brithday)
    assert.equal(user1.brithday.toString(), user2.brithday.toString())
    assert.equal(user1.contacts.length, user2.contacts.length)
    assert.equal(Company, user1.company.constructor)
    assert.equal(Contact, user1.contacts[0].constructor)
  })

  it('Model.fromData(data)', () => {
    var data = {
      id: 100,
      xing_ming: 'Charles Lo',
      sheng_ri: '1991-12-26',
      gong_si: {
        ming_cheng: '深圳市腾讯计算机系统有限公司',
        di_zhi: '深圳市南山区腾讯大厦'
      },
      lian_xi_fang_shi: [{
        lei_xin: '手机号',
        hao_ma: '18666666666'
      }, {
        lei_xin: '微信号',
        hao_ma: 'wx199111111'
      }, {
        lei_xin: '邮箱',
        hao_ma: 'wx199111111@qq.com'
      }]
    }
    var user1 = new User().fromData(data)
    var user2 = User.fromData(data)

    assert.equal(user1.name, user2.name)
    assert.notEqual(user1, user2)
    assert.notEqual(user1.brithday, user2.brithday)
    assert.equal(user1.brithday.toString(), user2.brithday.toString())
    assert.equal(user1.contacts.length, user2.contacts.length)
    assert.equal(Company, user1.company.constructor)
    assert.equal(Contact, user1.contacts[0].constructor)
  })

  it('model.$modelize', () => {
    var user = new User({ id: 100, name: 'Charles Lo'})
    delete user.$modelize
    assert.equal(true, user.$modelize)
  })

  it('model.clone()', () => {
    var user = new User({ id: 100, name: 'Charles Lo'})
    var newUser1 = user.clone()
    var newUser2 = User.clone(user)
    assert.notEqual(newUser1, user)
    assert.notEqual(newUser2, user)
    assert.notEqual(newUser1, newUser2)
    assert.equal(newUser1.name, newUser1.name)
  })
})
