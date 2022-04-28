import { init } from 'snabbdom/build/package/init.js'
import { h } from 'snabbdom/build/package/h.js'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
const patch = init([
  styleModule,
  eventListenersModule
])
// let vnode = h('div#container','新内容')

// let vnode = h('div#container', [
//   'dd',
//   h('p.p1', 'p标签'),
//   h('h3.xx', '`h3`标签')
// ])

// let vnode = h('!')

let vnode = h('div#container', {
  style: {
    backgroundColor: 'red'
  },
  on: {
    click () {
      alert(1)
    },
    contextmenu: function(e){
      alert(2)
      e.preventDefault()
      e.stopPropagation()
    }
  }
}, [
  h('h1','新内容h1'),
  h('div.xxx', [
    h('p','p标签'),
    h('li','li标签')
  ])
])



let app = document.querySelector('#app')
patch(app, vnode)