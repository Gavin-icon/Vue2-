// 对于订阅者，存在以下功能：①读取数据，旧的和新的数据，vm+key访问，cb更新视图的功能：接收vm,key,cb ②存储旧值 oldValue ③更新视图的方法 update
class Watcher {
  constructor(vm, key, cb) {
    // Vue实例
    this.vm = vm
    // 订阅者执行数据操作时数据的属性名
    this.key = key
    // 数据变化执行的回调
    this.cb = cb

    // 触发getter前，将当前订阅者实例存储给Dep类
    Dep.target = this
    // 存储旧值，观察值是否变化,没变化没有必要更新  |  存储的同时访问了vm[key]，触发了响应式数据的getter
    this.oldValue = vm[key]
    // 清空Dep.target
    Dep.target = null
  }
  // 封装数据变化时更新视图的功能
  update () {
    // 数据变化了存储新值
    const newValue = this.vm[this.key]
    if (newValue === this.oldValue) return
    // 变化的话执行回调函数，将newValue传递进去进行视图更新
    this.cb(newValue)
  }
}