import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import { normolizeValue, isValueType, isModelType, isModelSetType } from './util'

/**
 * Attribute
 * 属性类
 */
class Attribute {
  /**
   * 构造函数
   * @param  {String} name    属性名
   * @param  {Object} options 属性选项（OR直接设置类型）
   * @param  {Class}  ModelClass 模型类
   */
  constructor (name, options, ModelClass) {
    let attribute = options

    // 支持直接设置类型：{ name: String }
    if (!isPlainObject(options)) {
      attribute = {
        type: options
      }
    }

    // 判断属性类型是不是有引用自身（type 值为 undefined 或 Array(undefined) 即视为引用了模型自身）
    if (attribute.type === undefined) {
      // 类型指向模型自身
      attribute.type = ModelClass
    } else if (Array.isArray(attribute.type) && attribute.type[0] === undefined) {
      // 类型指向模型自身数组
      attribute.type = Array(ModelClass)
    }

    // 混合到属性实例
    Object.assign(this, {
      name: name,
      type: undefined,
      default: undefined
    }, attribute)
  }

  /**
   * 计算默认值
   * @return {Any} 默认值
   */
  getDefaultValue () {
    let defaultValue = this.default

    if (isFunction(defaultValue)) {
      defaultValue = defaultValue()
    }

    return defaultValue
  }

  /**
   * 标准化属性值
   * @param  {Any} value 值
   * @return {Any}       标准化值
   */
  normolizeValue (value) {
    // 如果为空则使用默认值
    value = value === undefined ? this.getDefaultValue() : value

    // 标准化类型值
    value = normolizeValue(value, this.type)

    return value
  }

  /**
   * 标准化接口数据属性值
   * @param  {Any} value 值
   * @return {Any}       标准化值
   */
  normolizeDataValue (value) {
    const Type = this.type

    // 如果为空则使用默认值
    if (value === undefined) {
      value = this.getDefaultValue()
      value = normolizeValue(value, Type)

    // 如果为模型类则使用 fromData 转换
    } else if (isModelType(Type)) {
      value = new Type().fromData(value)

    // 如果为模型类集合则使用 fromDataSet 转换
    } else if (isModelSetType(Type)) {
      const ItemType = Type[0]
      value = ItemType.fromDataSet(value)

    // 常规类型属性
    } else {
      value = normolizeValue(value, Type)
    }

    return value
  }

  /**
   * 是否为值类型
   * @return {Boolean} bool
   */
  isValueType () {
    return isValueType(this.type)
  }

  /**
   * 是否为模型类型
   * @return {Boolean} bool
   */
  isModelType () {
    return isModelType(this.type)
  }

  /**
   * 是否为模型集合类型
   * @return {Boolean} bool
   */
  isModelSetType () {
    return isModelSetType(this.type)
  }
}

export default Attribute
