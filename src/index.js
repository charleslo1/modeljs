import Model from './Model'
import isPlainObject from 'lodash/isPlainObject'

/**
 * 定义模型
 * @param  {String} name       模型名称
 * @param  {Object} attributes 模型定义对象
 * @return {Function}          模型类
 */
Model.define = function (name, attributes) {
  // 继承 Model
  const ModelClass = class extends Model {}

  // 判断是否需要声明为匿名模型类
  if (isPlainObject(name)) {
    attributes = name
    name = 'AnonymousModel'
  }

  // 初始化模型类
  ModelClass.init(name, attributes)

  // 返回
  return ModelClass
}

/**
 * 安装插件
 * @param  {Object} plugin      插件对象
 * @param  {Object} options     插件选项
 */
Model.use = function (plugin, options) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return Model
  }

  const args = Array.from(arguments).slice(1)
  args.unshift(Model)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return Model
}

// export
export default Model
