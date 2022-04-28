// 消息中心
class Dep {
  constructor() {
    // 存储订阅者
    this.subscipe =  []
  }
  // 添加订阅者 --什么时候添加订阅者呢？ 当我么实例化订阅者时就应该网subscripe中添加订阅者
  addSub (sub) {
    if (sub && sub.update)
    this.subscipe.push(sub)
  }
  // 通知订阅者 --什么时候通知订阅者？ 当Observer观察到数据变化后通知
  notify () {
    this.subscipe.forEach(sub => sub.update())
  }
}