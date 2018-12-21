import getValue from 'lodash/get'
import setValue from 'lodash/set'
import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'

/**
 * 模型基类
 */
class ModelBase {
  /**
   * 模型构造函数
   * @param  {Object} values 模型属性数据
   * @return {[type]}        [description]
   */
  constructor (values = {}) {
    // 对象的实际值
    this._initValues(values)
  }

  /**
   * 初始化模型数据
   * @param  {Object} values 模型属性数据
   */
  _initValues (values = {}) {
    const attributes = this.constructor.attributes
    mapValues(attributes, (attribute, name) => {
      let defaultValue = this.constructor.getDefaultValue(name)
      let value = values[name] || defaultValue
      this.set(name, value)
    })
  }

  /**
   * 获取模型属性值
   * @param  {String} name 属性名称
   * @return {Any}         属性值
   */
  get (name) {
    return this[name]
  }

  /**
   * 设置模型属性值
   * @param {String} name  属性名称
   * @param {Any} value    属性值
   */
  set (name, value) {
    if (!name) throw new Error('name 参数不能为空！')
    this[name] = value
  }

  /**
   * 克隆当前模型对象
   * @return {Object}  克隆的新模型对象
   */
  clone () {
    return this.constructor.clone(this)
  }

  /**
   * 从 api 数据对象转换为模型对象
   * @param  {Object} data api 数据对象
   * @return {Model}      模型对象
   */
  fromData (data = {}) {
    const attributes = this.constructor.attributes
    mapValues(attributes, (attribute, name) => {
      let path = attribute.field || name
      let defaultValue = this.constructor.getDefaultValue(name)
      let value = getValue(data, path, defaultValue)
      this.set(name, value)
    })

    return this
  }

  /**
   * 将模型对象转换为 api 数据对象
   * @return {Object} api 数据对象
   */
  toData () {
    let data = {}
    const attributes = this.constructor.attributes
    mapValues(attributes, (attribute, name) => {
      let path = attribute.field || name
      let value = this.get(name)
      setValue(data, path, value)
    })

    return data
  }

  /**
   * 创建模型对象
   * @param  {Object} values 模型属性值
   * @return {Model}        模型对象
   */
  static create (values) {
    if (Array.isArray(values)) {
      return this.bulkCreate(values)
    }

    return new this(values)
  }

  /**
   * 克隆模型对象
   * @param  {Object} model 模型对象
   * @return {Model}        新模型对象
   */
  static clone (model) {
    return this.create(model)
  }

  /**
   * 批量创建模型对象
   * @param  {Array<Object>}  valueSets 模型属性值集合
   * @return {Array<Model>}             模型集合
   */
  static bulkCreate (valueSets = []) {
    return valueSets.map((values) => this.create(values))
  }

  /**
   * 从 api 数据创建模型数据
   * @param  {Object} data api 数据
   * @return {Model}      模型对象
   */
  static fromData (data = {}) {
    if (Array.isArray(data)) {
      return this.fromDataSet(data)
    }

    return new this().fromData(data)
  }

  /**
   * 从 api 数据对象集合批量创建模型对象集合
   * @param  {Array<Object>} data api 数据集合
   * @return {Array<Model>}       模型对象集合
   */
  static fromDataSet (dataSet = []) {
    return dataSet.map((data) => this.fromData(data))
  }

  /**
   * 将模型对象集合批量转换为 api 数据对象集合
   * @param  {Array<Model>} models 模型对象集合
   * @return {Array<Object>}       api 数据集合
   */
  static toDataSet (models = []) {
    return models.map((model) => model.toData())
  }

  /**
   * 初始化模型类
   * @param  {String} name       模型类名称
   * @param  {[type]} attributes 模型定义对象
   * @return {[type]}            模型类
   */
  static init (name, attributes) {
    // 设置模型名称
    Object.defineProperty(this, 'name', { value: name })
    // 设置模型
    this.attributes = mapValues(attributes, (attribute, key) => this.normalizeAttribute(attribute))
    this.defaults = mapValues(attributes, (attribute, key) => (attribute.default || attribute.defaultValue))
    this.modelize = true

    return this
  }

  /**
   * 标准化属性定义
   * @param  {Object} attribute 属性定义对象
   * @return {Object}           属性定义对象
   */
  static normalizeAttribute (attribute) {
    if (!isPlainObject(attribute)) {
      attribute = {
        type: attribute
      }
    }

    return attribute
  }

  /**
   * 获取属性定义对象
   * @param  {String} name       属性名
   * @return {Object}            属性定义对象
   */
  static getAttribute (name) {
    return this.attributes[name]
  }

  /**
   * 标准化属性定义
   * @param  {String} name       属性名
   * @return {Object}            属性定义对象
   */
  static getDefaultValue (name) {
    let attribute = this.getAttribute(name)
    if (!attribute) return undefined
    let defaultValue = attribute.default !== undefined ? attribute.default : attribute.defaultValue
    if (isFunction(defaultValue)) {
      defaultValue = defaultValue()
    }

    return defaultValue
  }
}

/**
 * 模型类
 */
class Model {
  constructor (name, attributes) {
    const ModelClass = class extends ModelBase {}
    ModelClass.init(name, attributes)
    return ModelClass
  }
}

/**
 * 定义模型
 * @param  {String} name       模型名称
 * @param  {Object} attributes 模型定义对象
 * @return {Function}          模型类
 */
Model.define = function (name, attributes) {
  return new Model(name, attributes)
}

/**
 * 安装插件
 * @param  {Object} plugin      插件对象
 * @param  {Object} options     插件选项
 */
Model.use = function (plugin, options) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return ModelBase
  }

  const args = Array.from(arguments).slice(1)
  args.unshift(ModelBase)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return ModelBase
}

// export
export default Model
