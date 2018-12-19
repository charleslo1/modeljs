```
var User = Model.define(Person, {
  props: {
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
  },

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


var user = new User()
user.load()
user.fromJSON(data)
user.toJSON()
user.validate()
user.save()

```
