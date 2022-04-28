// ①配置项注入Vue实例中-$el、$data、options | ②vm数据劫持data数据 | 
class Vue {
  constructor(options) {
    // 传入new Vue时的配置options
    this.options = options || {}
    // 从options中拿到el选项并作出响应的判断
    const { el } = options
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    // 把data数据注入Vue实例
    this.$data = options.data
    // 通过数据劫持 将数据劫持在 Vue实例对象中 
    // [本来也可以通过Vue实例对象 . key 进行访问，劫持后直接 Vue实例 . key 访问！]
    _proxyData(this, this.$data)

    // 通过实例化一个observer类来进行数据侦听data
    new Observer(this.$data)

    // 初始化编译
    new Compiler(this)
  }
}
function _proxyData(target, data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(target, key, {
      // 可遍历
      enumerable: true,
      // 可再次配置
      configurable: true,
      // 配置setter和getter
      get () {
        return data[key]
      },
      set (newValue) {
        data[key] = newValue
      }
    })
  })
}