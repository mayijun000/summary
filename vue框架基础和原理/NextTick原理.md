# NextTick原理

### 使用场景

在进行获取数据后，需要对新视图进行下一步操作或者其他操作时，发现获取不到 DOM

1.在Vue生命周期的created()钩子函数进行DOM操作一定要放到Vue.nextTick()的回调函数中。

在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳，所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。与之对应的就是mounted()钩子函数，因为该钩子函数执行时所有的DOM挂载和渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题。

2.在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick()的回调函数中。

### 原理

在 Vue 中多么频繁地修改数据，最后 Vue 页面只会更新一次

被修改时，会通知所有收集到的 watcher 进行更新（watcher.update）

当数据变化后，把 watcher.update 函数存放进 nextTick 的 回调数组中，并且会做过滤。

通过 watcher.id 来判断 回调数组 中是否已经存在这个 watcher 的更新函数

不存在，才 push

之后 nextTick 遍历回调数组，便会执行了更新

vue在内部尝试对异步队列使用原生的Promise.then和MessageChannel 方法，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。





参考资料：https://zhuanlan.zhihu.com/p/69641232