```
// 定义模型
var User = Model.define('User', {
  id: {
    type: Number,
    map: 'uuid',
    default: 0,
    roles: [{
      require: true,
      message: 'ID不能为空'
    }]
  },
  name: {
    type: String,
    map: 'nikeName',
    default: '',
    roles: [{
      require: true,
      message: 'ID不能为空'
    }]
  },
  brithday: {
    type: String,
    map: 'brithday',
    format: 'YYYY-MM-DD',
    default: '',
    roles: [{
      require: true,
      message: '生日不能为空'
    }]
  }

  methods: {
    async load () {
      let { data } = await userApi.get({id: this.id})
      this.fromJSON(data)
    },

    async save () {
      let { data } = await userApi.save(this.toJSON())
      return data
    }
  }
})

// 方法
User.prototype.load = async function () {
  let { data } = await userApi.get({id: this.id})
  this.fromJSON(data)
}

User.prototype.save = async function () {
  let { data } = await userApi.get({id: this.id})
  this.fromJSON(data)
}

// 静态方法
User.find = async function (id) {
  let { data } = await userApi.get({id: id})
  return new User().fromJSON(data)
}

// use
var user = new User({id: '100'})
user = User.find('100')
user.load()
user.fromJSON(json)
user.toJSON()
user.validate()
user.save()

```
