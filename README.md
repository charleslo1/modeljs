# modeljs
> 简单高效的 JS 数据模型定义库，帮助前后端数据结构轻松解耦，提高程序健壮性 💪💪💪

![modeljs](./assets/modeljs.png)

# Intro
随着SPA应用的兴起，前后端分离的开发模式大行其道，使得前后端各司其职，大大减少了沟通协作成本。大多数情况下前端只需调用后端的接口将数据使用合适的方式直接展现出来，然后接受用户输入直接调用接口传入后端。这种方式在参与人数少的中小型项目并没有什么问题，但随着项目越来越大，模块越来越复杂，参与人员也越来越多，前端的匿名业务对象使得应用内流转的数据处于一种不透明的状态，稍有不慎就可能引发程序崩溃，同时后端在接口层面的耦合也使得接口的变更对前端的影响也越来越大，造成了新的协作成本，因此使用模型化来规范业务对象对于某些项目来说很有必要。

* 匿名业务对象使得应用内流转的数据处于一种不透明的状态，稍有不慎就可能引发程序崩溃
* 匿名业务对象在不同页面需要重新定义，代码复用率低，且标准不统一
* 前端直接使用接口数据导致接口变更对前端影响范围不可控，增加了新的协作成本
* 为了保证程序健壮性，前端不得不在任何用到接口数据的地方编写更多无聊的防御性代码

modeljs 是一个简单高效的 JS 数据模型定义库，可以帮助前端轻松的定义好应用业务模型，同时提供简洁的 API 来进行前后端接口数据双向映射，使前后端在数据结构层面获得一定程度的解耦，从而提高程序可靠性。

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
import http from 'axios'

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

// 可使用原型扩展自定义方法
User.prototype.load = async function () {
  let { data } = await http.get({id: this.id})
  this.fromData(data)
  return this
}

User.prototype.save = async function () {
  let data = this.toData()
  return await http.post(data)
}

export default User
```

##### 基本使用
``` js
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

// 使用自定义方法
var user = new User({ id: 101 })
await user.load()
console.log(user.name)          // 张三

user.name = '李四'
await user.save()
```

##### 接口数据映射
``` js
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

# API

``` js
import Model from 'modejs-core'

/**
 * 安装插件
 * @param  {Object} plugin      插件对象
 * @param  {Object} options     插件选项
 */
Model.use(plugn, options)

/**
 * 定义模型
 * @param  {String} name       模型名称
 * @param  {Object} attributes 模型定义对象
 * @return {Function}          模型类
 */
const ModelClass = Model.define(name, attributes)

/**
 * 创建模型对象
 * @param  {Object} values 模型属性值
 * @return {Model}        模型对象
 */
var model = ModelClass.create(values)
// 等同于
var model = new ModelClass(values)

/**
 * 批量创建模型对象
 * @param  {Array<Object>}  valueSets 模型属性值集合
 * @return {Array<Model>}             模型集合
 */
var models = ModelClass.bulkCreate(valueSets)

/**
 * 从 api 数据对象转换为模型对象
 * @param  {Object} data api 数据对象
 * @return {Model}      模型对象
 */
model.fromData(data)
// 等同于
var model = ModelClass.fromData(data)

/**
 * 将模型对象转换为 api 数据对象
 * @return {Object} api 数据对象
 */
var data = model.toData()

/**
 * 从 api 数据对象集合批量创建模型对象集合
 * @param  {Array<Object>} data api 数据集合
 * @return {Array<Model>}       模型对象集合
 */
ModelClass.fromDataSet(dataSet)

/**
 * 将模型对象集合批量转换为 api 数据对象集合
 * @param  {Array<Model>} models 模型对象集合
 * @return {Array<Object>}       api 数据集合
 */
var dataSet = ModelClass.toDataSet(models)
```

![star](https://user-gold-cdn.xitu.io/2018/7/24/164ca9c0e943dcd7?w=240&h=240&f=png&s=41877)

如果对你有用，欢迎 star ^_^