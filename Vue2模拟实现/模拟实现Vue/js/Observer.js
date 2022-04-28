class Observer {
  constructor(data) {
    // 将data传递进来
     this.data = data
     // 将data的属性获取并遍历
     this.walk(this.data)
  }
  walk (data) {
    // 遍历data属性后，
    Object.keys(data).forEach(key => this.convert(key, data[key]))
  }
  // 通过执行reactive函数将data的数据变为响应式数据，数据劫持方式转变
  convert (key, value) {
    reactive(this.data, key, value)
  }
}

// 转换为响应式数据
function reactive (data, key, value) {
  // 创建消息中心
  const dep = new Dep()
  // 检测value是否是对象，如果value是对象，那我们再次调用Observer类
  observer(value)
  Object.defineProperty(data, key, {
    // 可遍历
    enumerable: true,
    // 可再次配置
    configurable: true,
    // 设置getter 和 setter
    get () {
      // 不能直接直接添加订阅者，触发条件应该是：Dep.target存在时添加，防止console时触发getter,且Dep.target存储了watcher实例 ,让消息中心添加订阅者
      Dep.target && dep.addSub(Dep.target)
      return value
    },
    set (newValue) {
      if (value === newValue) return
      value = newValue
      observer()
      // * 数据变化通过dep类通知订阅者
      dep.notify()
    }
  })
}

function observer(value) {
  if (typeof value === 'object' && value !== null) {
    return new Observer(value)
  }
}
