class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compiler(this.el)
  }
  compiler (el) {
    // 查看绑定元素内部的节点数据,并根据节点类型不同作出不同的处理
    // console.log(el.childNodes)
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
        // console.log(node)
        if (isTextNode(node)) {
          this.compileText(node)
        } else if (isElementNode(node)) {
          this.compileElement(node)
        } else {
          if (node.childNodes && node.childNodes.length) {
            this.compiler(node)
          }
        }
    })
  }

  // 封装编译文本节点的办法,{{ data1 }} -->正则匹配{{}},exec获取对应内容,处理空格
  compileText (node) {
    // console.dir(node)
    const reg = /\{\{(.+?)\}\}/g
    const value = node.textContent.replace(/\s/g, '')
    // 存储数据+拼接编译后的数据
    const tokens = []
    // 存储起始索引
    let index = 0
    // 存储当前操作的索引
    let curIndex
    let result
    while (result = reg.exec(value)) {
      // console.log(result)
      // 为当前操作的索引赋值
      curIndex = result.index
      // 将不需要编译的普通文本先存入数组,当前操作的索引大于起始索引才能push
      if (curIndex > index) {
        tokens.push(value.slice(index, curIndex))
      }
      // 存储当前的key，并通过key查找对应的响应式数据，通过trim方法去除首尾空格,然后将数据push进去
      const key = result[1].trim()
      tokens.push(this.vm[key])

      // 更新index，起始索引
      index = curIndex + result[0].length

      // console.log(tokens)

      // 如果需要进行更新视图，进行下述步骤
      const pos = tokens.length-1 // tokens数组中的最后一项的索引，也就是响应式数据
      new Watcher(this.vm, key, newValue => {
        // tokens中存储新值
        tokens[pos] = newValue
        // 将数组中的数据同步到视图
        node.textContent = tokens.join('')
      })
    }
    // 不需要更新视图，直接输出结果
    node.textContent = tokens.join('')
  }

  compileElement (node) {
    // 如果元素节点内部还存在节点，走compiler路线，继续递归
    // 主要看的是指令,即自定义HTML属性--node.attributes，其余不管
    const attributes = node.attributes
    Array.from(attributes).forEach(attr => {
      // console.log(attr) --> v-text="ms1"
      // 获取属性名
      let attrName = attr.name // v-text
      // 不是v-指令的不做处理
      if (!isDirective(attrName)) return
      
      // key
      let key = attr.value

      // 处理指令名称
      attrName = attrName.slice(2)
      // 是v-指令的话，进行进一步的处理,给当前的元素节点更新内容
      this.update(node, key, attrName)
    })
  }
  // 用于指令分配操作处理
  update (node, key, attrName) {
    // 名称处理,如果是text 就改为 textUpdater
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, key, this.vm[key])
  }
  // v-text处理
  textUpdater (node, key, value) {
    // 给元素设置内容
    node.textContent = value
    // 订阅数据
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  // v-model处理
  modelUpdater (node, key, value) {
    node.value = value
    // 订阅数据变化
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })
    // 监听input事件，依据视图去更新数据
    node.addEventListener('input', () => {
      // this.vm[key]是数据， node.value是视图的数据
      this.vm[key] = node.value
    })
  }
}

function isDirective (attrName) {
  return attrName.startsWith('v-')
}

function isTextNode (node) {
  return node.nodeType === 3
}

function isElementNode (node) {
  return node.nodeType === 1
}