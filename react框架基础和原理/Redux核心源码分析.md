# Redux核心源码分析

**获取代码**

Redux的代码就存放在github中，打开Redux的项目地址，就可以找到它的git地址，执行以下命令即可将代码下载到本地：

```text
git clone https://github.com/reduxjs/redux.git
```

这篇文章我是基于v4.0.4的代码tag版本来讲的，为保证我们看到的是同一份代码，需要执行以下命令：

```text
git checkout v4.0.4
```



**目录结构**

我觉得所谓阅读源代码，并不应该是像读文章一样从上往下一行一行的阅读。我自己读代码的习惯，是会先大概浏览一下一个项目的目录结构。那么我们就先看一下Redux的顶层目录结构:

```text
> tree -L 1 -d
.
├── build
├── docs
├── examples
├── logo
├── src
├── test
└── website

7 directories
```

如果你经常阅读开源项目的源码，马上就会知道，其实我们只需要关心src下的文件即可，其他目录中的文件都可以暂时忽略。这样就大大缩小了我们需要阅读代码的范围。

那么我们再来看一下src下都有哪些文件：

```text
> tree src
src
├── applyMiddleware.js
├── bindActionCreators.js
├── combineReducers.js
├── compose.js
├── createStore.js
├── index.js
└── utils
 ├── actionTypes.js
 ├── isPlainObject.js
 └── warning.js

1 directory, 9 files
```

这里的9个文件就是我们全部需要关心的代码文件了。而在本篇文章中，我们其实只会涉及到index.js、createStore.js、combineReducers.js这三个文件。



**入口文件**

对项目的目录结构有所了解之后，下一步我首先会找到一个项目的入口文件，这个文件通常为index.js。如果没有index.js文件，那就看看有没有main.js或{project_name}.js。如果都没有（通常这种情况较少），就需要自己去看一下package.json中定义的main字段，再来推敲一下了。

对于redux，它的入口文件就在src/index.js，我们来看一下它的核心代码有哪些（为了节省文章篇幅，我会对代码做一些删减，仅保留最核心的部分，下同）：

```js
// 引入各个模块
import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'
import __DO_NOT_USE__ActionTypes from './utils/actionTypes'
// 导出Redux的所有公开API
export {
 createStore,
 combineReducers,
 bindActionCreators,
 applyMiddleware,
 compose,
 __DO_NOT_USE__ActionTypes
}
```



这个文件和大多数JS库的入口文件差不多，就是提供整个库对外的API，export给外部使用。接下来我们会一一看一下它export的各个API的实现细节。



**createStore.js**

这个文件是Redux的核心，它提供了store的创建和维护，我们来看一下它的核心代码：

```js
// 整个文件只导出一个函数，就是createStore函数。参数如下：
// * reducer - 我们传入的reducer纯函数，用来定义我们的state可以做的操作，如果不懂它的概念可以参考上一篇文章
// * preloadedState - state的初始化值
// * enhancer - 当我们需要使用middleware的时候，会用到。
export default function createStore(reducer, preloadedState, enhancer) {
 // 当前的reducer。Redux支持我们替换当前的reducer为另一个函数
 let currentReducer = reducer
 // 用来存储我们整个程序的状态
 let currentState = preloadedState
 // 状态监听函数，当状态发生改变的时候会被调用。可以注册多个监听函数。
 let currentListeners = []
 // 这个是为了处理一些异常情况而保存一份currentListeners的shallow copy副本，不影响核心逻辑的理解，可以暂时忽略
 let nextListeners = currentListeners
 
 // 提供给外部调用，用来获取当前state。由于state是Redux的内部变量，外部只能通过API函数来获取状态。
 function getState() {
 return currentState
  }
 
 // 注册监听器，listener是回调函数，当状态被修改的时候调用
 function subscribe(listener) {
  nextListeners.push(listener)
  return function unsubscribe() {
  const index = nextListeners.indexOf(listener)
  nextlisteners.splice(index, 1)
  }
  }
 
 // dispatch用来修改一个状态
 function dispatch(action) {
 try {
      isDispatching = true
 // 调用当前的reducer，传入当前状态和action，然后将返回值更新为新状态
      currentState = currentReducer(currentState, action)
 } finally {
      isDispatching = false
    }
 // 依次调用监听器函数
 const listeners = (currentListeners = nextListeners)
 for (let i = 0; i < listeners.length; i++) {
 const listener = listeners[i]
      listener()
    }
 return action
  }
 
 // 更换reducer函数
 function replaceReducer(nextReducer) {
  currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }
 
 // dispatch一个INIT事件，外部可以监听这个事件，用于一些初始化的工作
  dispatch({ type: ActionTypes.INIT })
 
 // 返回值是一个对象，包含了用于获取和操作状态的函数
 return {
  dispatch,
  subscribe,
  getState,
  replaceReducer,
  }
}
```

我们使用Redux的时候，第一步就是要调用createStore来获得store对象。以上代码应该可以使你了解一个store对象到底包含哪些东西。这个文件也是Redux最核心的部分，所以请多看几遍源码，加深理解。

**combineReducers.js**

从createStore的API可以看到，我们传递给它的reducer只是一个函数，而在实际的项目中我们可能希望将不同业务部分的reducer分开写。Redux为我们提供了combineReducers，用于将多个reducer合并为一个总的reducer。

接下来我们就来看一下这个函数的实现：

```js
// 整个文件导出一个函数
// 参数reducers是一个Object，比如一个todo app可能包含users和todos两部分数据，那么它的格式如下：
// {
//    users: function userReducer(){},
//    todos: function todoReducer(){}, 
// }
export default function combineReducers(reducers) {
 // 获得reducerKeys，方便下面遍历reducers使用
 const reducerKeys = Object.keys(reducers)
 // finalReducers和reducers差不多，主要为了保证每个value都是一个function
 const finalReducers = {}
 for (let i = 0; i < reducerKeys.length; i++) {
  const key = reducerKeys[i]
  if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
  }
  }
 
 // 同样取得keys是为了方便遍历object
 const finalReducerKeys = Object.keys(finalReducers)
 // combineReducers的返回值，是一个函数(是个reducer，合并后的整体的reducer)。
 return function combination(state = {}, action) {
 // 状态是否发生了改变
  let hasChanged = false
 // 新的总体的状态
  const nextState = {}
  // 遍历所有reducers
  for (let i = 0; i < finalReducerKeys.length; i++) {
  // key，相当于每个reducer的名字
  const key = finalReducerKeys[i]
  // 当前正在遍历的reducer函数
  const reducer = finalReducers[key]
  // 当前reducer的老的state
  const previousStateForKey = state[key]
  // 当前reducer新的状态
 const nextStateForKey = reducer(previousStateForKey, action)
 // 将新的子状态放到整体状态的一个字段中，字段名就是reducer的名字
      nextState[key] = nextStateForKey
 // 判断状态是否发生改变。注意，这里判断是直接判断对象的引用，而不会深入判断对象内的字段。
 // 这也是为什么reducer中必须返回一个新的对象而不是修改老的对象
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
  }
 // 返回值，如发生改变返回新的状态，否则返回老状态。
  return hasChanged ? nextState : state
  }
}
```

可以看到其实这个文件的内容也是比较简单的，只要熟悉JS语言这段代码是非常容易理解的。



**其他文件**

上面我们介绍了Redux比较核心的两个文件，其实理解了createStore.js里的内容，Redux可以说就理解了一大半了。另外比较重要的还有相关的Middleware相关的几个文件，包括applyMiddleware.js和compose.js，我们留在下一篇文章中来介绍。

剩余的其他文件基本都是一些工具类的函数，不属于Redux的核心概念，我们在这里就不做分析了，大家有兴趣可以自己看一下。