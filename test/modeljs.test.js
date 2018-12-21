global.wx = {
  setStorageSync: () => {},
  getStorageSync: () => {},
  request: () => {}
}
const assert = require('assert')

const Model = require('../dist/modeljs')
const User = Model.define('User', {
  id: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: 'name'
  }
})

// 测试 modeljs.js
describe('modeljs.js', () => {

  it('Model.define(props)', () => {
    var user = new User({ id: 100, name: 'Charles Lo'})
    assert.equal('Charles Lo', user.name)
  })

  it('Model.create(values)', () => {
    var obj = { id: 100, name: 'Charles Lo'}
    var user1 = new User(obj)
    var user2 = User.create(obj)
    assert.equal(user1.name, user2.name)
    assert.notEqual(user1, user2)
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
