import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import { normolizeValue, isModelType, isModelSetType } from './util'

/**
 * Attribute
 * 属性类
 */
class Attribute {
  /**
   * 构造函数
   * @param  {String} name    属性名
   * @param  {Object} options 属性选项
   */
  constructor (name, options) {
    let attribute = options
    if (!isPlainObject(options)) {
      attribute = {
        type: options
      }
    }

    Object.assign(this, {
      name: '',
      type: String,
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
      value = Type.fromData(value)

    // 如果为模型类集合则使用 fromData 转换
    } else if (isModelSetType(Type)) {
      const ItemType = Type[0]
      value = ItemType.fromDataSet(value)

    // 常规类型属性
    } else {
      value = normolizeValue(value, Type)
    }

    return value
  }
}

export default Attribute
