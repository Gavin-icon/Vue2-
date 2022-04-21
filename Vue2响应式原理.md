### 深入了解Vue2 的响应式原理
```
1.vue2是如何实现数据驱动视图的？ 【此处property = 变量，通过变量声明的property】
对于Vue而言，无论是全局组件还是局部组件，我们会将一个普通的JavaScript对象挂载在Vue实例上[方式分别为：全局组件通过el选项挂载,局部组件通过被引入并注册挂载]，并将该对象作为data选项，而Vue会遍历该对象[该对象可以说是data选项也可以说是该JavaScript对象]的所有属性，然后通过Object.defineProperty()将这些属性转换为getter/setter；当我们读取property的属性值时，通过getter可以直接读取该属性值并且进行一些DOM操作去渲染HTML；当我们修改property的属性值时，setter内部可以获取到设置的属性值并赋值给对应的属性，然后进行一些DOM操作去渲染HTML。
```

```
2.为什么Vue2会有兼容性的问题？
对于Vue2而言，采用Object.defineProperty()方法去进行数据驱动视图变化的，而Object.defineProperty()方法是ES5中的一个没有办法去shim的特性，即没有办法去通过一些插件去降级处理到达兼容，所以Vue2不支持IE9以下的浏览器。
```

```
3.自己实现Vue2中的响应式原理，因为绑定不同的数据需要模板，此时暂不做研究
(1)获取JavaScript对象：let app = document.querySelector('#app)
(2)JavaScript对象作为data选项，设置data
  data: {
    data1: '',
    data2: '',
    arr: [1,2,3],
    obj: {
      obj1: ''
    }
  }
(3)创建一个vm实例，方便进行数据劫持，访问data
  let vm = {}
(4)由于数组不能被defineProperty()中的get和set侦测到，故而需要自定义一个原型对象，使得数组使用我们封装的方法
  4-1: 定义一个数组保存我们的方法
    let arrMethodName = ['push','pop','unshift','shift','splice','sort']
  4-2：定义一个自定义的原型对象，里边保存着我们封装的方法
    let custProto = {}
  4-3：遍历arrMethodName，借助数组的方法使得custProto封装好我们的方法
    arrMethodName.forEach(method => {
      custProto[method] = function(){
        const result = Array.prototype[method].apply(this, arguments)
        4-3-1：实现视图更新
          app.textContent = this?????
        return result
      }
    })
(5)封装一个递归的函数，如果data中存在对象的话，我们通过递归来解决这种嵌套问题
  function(vm, data) {
    5-1：获取data中的属性，并执行遍历操作
    Object.keys(data).forEach(key => {
      5-1-1：判断当前key是否为数组、对象
      if (Array.isArray(data[key])) {

        5-1-1-a：如果为数组的话，我们修改它的__proto__指针指向，即修改它的原型指向,使其指向为我们自定义的原型对象custProto
          data[key].__proto__ = custProto

      } else if (typeof data[key] === 'object' && typeof data[key] !== null) {
        5-1-1-b：如果是对象的话，我们让其递归
          let vm[key] = {} ????????????
          createReactive(vm[key], data[key])
      }

      5-1-2：如果data[key]不是数组，不是对象，我们进行vm数据劫持，并且侦听data中的数据变化，响应的作出响应
      Object.defineProperty(vm, key, {
        5-1-2-a：配置数据劫持时的选项
          enumerable: true,
          configurable: true,
        5-1-2-b：配置getter和setter
          get () {
            5-1-2-b-*：如果data[key]是''，我们让其等于默认app中的内容
            if (data[key] = '') {
              data[key] = app.textContent
            }
            return data[key]
          },
          set (newValue) {
            data[key] = newValue
            app.textContent = data[key]
          }
      })
    })
  }
(6)封闭为立即执行函数，使得自己封装的原型只会被执行一次
  const createReactive = (function(){

    引入(4)

    return 引入(5)

  })()
  createReactive(vm, data)
```