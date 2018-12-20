# modeljs
> 简单高效的 JS 数据模型定义库，帮助前后端数据结构轻松解耦

# Intro
随着SPA应用的兴起，前后端分离的开发模式大行其道，使得前后端各司其职，大大减少了沟通协作成本。大多数情况下前端只需调用后端的接口将数据使用合适的方式直接展现出来，然后接受用户输入直接调用接口传入后端。这种方式在参与人数少的中小型项目并没有什么问题，但随着项目越来越大，模块越来越复杂，参与人员也越来越多，前端的匿名业务对象使得数据流处于一种不透明的状态，稍有不慎就可能引发程序崩溃，同时后端在接口层面的耦合也使得接口的变更对前端的影响也越来越大，造成了新的协作成本，因此使用模型化来规范业务对象对于某些项目来说很有必要。

modeljs 是一个简单高效的 JS 数据模型定义库，可以帮助前端轻松的定义好应用业务模型，同时提供简洁的 API 来进行前后端接口数据双向映射，使前后端在数据结构层面获得一定程度的解耦，提高程序可靠性。

# Featrues
- [x] 轻松定义应用业务模型
- [x] 支持后端接口数据双向映射
- [ ] 支持验证插件对模型进行数据验证

# Install
```
npm install modeljs-core --save
```

# Usage

##### 模型定义：User.js
``` js
import Model from 'modeljs-core'

// 定义模型
const User = Model.define('User', {
  id: {
    type: Number,
    field: 'uuid'           // 接口字段映射
    default: 0
  },
  name: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    field: 'company.name',   // 接口字段映射
    default: ''
  }
})

export default User
```

##### 基本使用
```
import User from './User'

// 实例化
var user = new User({
    id: 100,
    name: 'Charles Lo',
    companyName: 'XX公司'
})

console.log(user.id)            // 100
console.log(user.name)          // Charles Lo
console.log(user.companyName)   // XX公司
```

##### 接口映射
```
import User from './User'

// 实例化
var user = new User()

// 正向映射
var { data } = await http.get('/user/101')
// data 的结构：{ uuid: 101, name: '张三', company: { name: '张三的公司' } }

user.fromData(data)

console.log(user.id)            // 101
console.log(user.name)          // 张三
console.log(user.companyName)   // 张三的公司

// 批量正向映射
var { data } = await http.get('/user/list')
// data 的结构：[{ uuid: 101, name: '张三', company: { name: '张三的公司' } }, ...]

var users = User.fromDataSet(data)

console.log(users[0].id)            // 101
console.log(user[0].name)          // 张三
console.log(user[0].companyName)   // 张三的公司

// 反向映射
var user = new User({
    id: 101,
    name: '张三',
    companyName: '张三的公司'
})

var data = user.toData()
// data 的结构：{ uuid: 101, name: '张三', company: { name: '张三的公司' } }
await http.post('/user/save', data)

// 批量反向映射
var users = User.bulkCreate([{
    uuid: 101,
    name: '张三',
    company: { id: 1, name: '张三的公司' }
}, {
    ...
}])

var data = User.toDataSet(users)
// data 的结构：[{ uuid: 100, name: 'Charles Lo', company: { id: 1, name: 'XX公司' } }, ...]

await http.post('/user/addlist', data)

```

![star](https://user-gold-cdn.xitu.io/2018/7/24/164ca9c0e943dcd7?w=240&h=240&f=png&s=41877)

如果对你有用，欢迎 star ^_^