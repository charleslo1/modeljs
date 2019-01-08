import Model from './Model'
import isFunction from 'lodash/isFunction'

// 值类型列表
const valueTypes = [
  String,
  Number,
  Boolean,
  null,
  undefined
]

/**
 * 判断指定类型是否为值类型
 * @param  {Any}  type  类型
 * @return {Boolean}    是否为值类型
 */
export const isValueType = (Type) => {
  return valueTypes.indexOf(Type) >= 0
}

/**
 * 判断指定类型是否为模型类型
 * @param  {Any}  type  类型
 * @return {Boolean}    是否为模型类型
 */
export const isModelType = (Type) => {
  return Type && (Type.prototype instanceof Model)
}

/**
 * 判断指定类型是否为模型集合类型
 * @param  {Any}  type  类型
 * @return {Boolean}    是否为模型集合类型
 */
export const isModelSetType = (Type) => {
  return Array.isArray(Type) && isModelType(Type[0])
}

/**
 * 标准化值
 * @param  {Any} value    值
 * @param  {Any} Type     类型
 * @return {Any}          标准化值
 */
export const normolizeValue = (value, Type) => {
  // 引用类型
  if (isFunction(Type) && !isValueType(Type)) {
    // 数组特殊处理
    if (Type === Array) {
      value = Array.isArray(value) ? value : []
    } else {
      value = value ? new Type(value) : new Type()
    }

  // 特殊集合类型
  } else if (Array.isArray(Type)) {
    const ItemType = Type[0]
    value = Array.isArray(value) ? value : []
    value = value.map((item) => normolizeValue(item, ItemType))

  // 值类型
  } else {
    value = (isFunction(Type) && value !== undefined) ? Type(value) : value
  }

  return value
}
