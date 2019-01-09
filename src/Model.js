import getValue from 'lodash/get'
import setValue from 'lodash/set'
import mapValues from 'lodash/mapValues'
import Attribute from './Attribute'

/**
 * Model
 * 模型类
 */
class Model {
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
      let value = values[name]
      value = attribute.normolizeValue(values[name])
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
   * 从api数据对象转换为模型对象
   * @param  {Object} data api数据对象
   * @return {Model}      模型对象
   */
  fromData (data = {}) {
    // 排除空值和数组类型（后端可能返回的默认空对象）
    if (!data || Array.isArray(data)) return this

    // 映射属性值
    const attributes = this.constructor.attributes
    mapValues(attributes, (attribute, name) => {
      let path = attribute.field || name
      let value = getValue(data, path)
      value = attribute.normolizeDataValue(value)
      this.set(name, value)
    })

    return this
  }

  /**
   * 将模型对象转换为 api数据对象
   * @return {Object}  api数据对象
   */
  toData () {
    let data = {}
    const attributes = this.constructor.attributes
    mapValues(attributes, (attribute, name) => {
      // 获取属性访问路径和值
      let path = attribute.field || name
      let value = this.get(name)

      // 模型对象：调用模型对象的 toData 方法获取值
      if (attribute.isModelType() && value) {
        value = value.toData()

      // 模型集合：调用模型的 toDataSet 方法获取值
      } else if (attribute.isModelSetType()) {
        value = Model.toDataSet(value)
      }

      // 设置值
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
   * 从api数据创建模型数据
   * @param  {Object} data api数据
   * @return {Model}       模型对象
   */
  static fromData (data = {}) {
    if (Array.isArray(data)) {
      return this.fromDataSet(data)
    }

    return new this().fromData(data)
  }

  /**
   * 将模型对象转换为 api数据对象
   * @param  {Model}  model 模型对象
   * @return {Object}       api数据对象
   */
  static toData (model = {}) {
    if (Array.isArray(model)) {
      return this.toDataSet(model)
    }

    return model.$modelize ? model.toData() : new this(model).toData()
  }

  /**
   * 从api数据对象集合批量创建模型对象集合
   * @param  {Array<Object>} data api数据集合
   * @return {Array<Model>}       模型对象集合
   */
  static fromDataSet (dataSet = []) {
    return dataSet.map((data) => this.fromData(data))
  }

  /**
   * 将模型对象集合批量转换为 api数据对象集合
   * @param  {Array<Model>} models 模型对象集合
   * @return {Array<Object>}       api数据集合
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
    // 属性定义对象
    this.attributes = mapValues(attributes, (attribute, name) => new Attribute(name, attribute))
    // 属性默认值对象
    // this.defaults = mapValues(attributes, (attribute, name) => attribute.default)

    // 定义模型类属性
    Object.defineProperties(this, {
      // 模型名称
      name: {
        value: name,
        configurable: false,
        enumerable: false,
        writable: false
      }
    })

    // 定义模型类原型属性
    Object.defineProperties(this.prototype, {
      // 模型化属性
      $modelize: {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false
      }
    })

    return this
  }

  /**
   * 获取属性定义对象
   * @param  {String} name       属性名
   * @return {Object}            属性定义对象
   */
  static getAttribute (name) {
    return this.attributes[name]
  }
}

// export
export default Model
