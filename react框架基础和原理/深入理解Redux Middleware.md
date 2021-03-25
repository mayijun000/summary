# 深入理解Redux Middleware

**Middleware是什么?**

写过node的同学大都接触过middleware的概念，比如express的后端框架都有middleware。那么到什么是一个middleware呢？从字面意思上理解，middleware是“中间件”的意思。我的理解是，一个框架的middleware，就是指这个框架允许我们在某个流程的执行中间插入我们自定义的一段代码。官网的说法是：

> It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.

和express类似，Redux的middleware也有几个特性：

1. 关于执行时机。middleware的代码执行时机是由框架确定的，我们只能定义代码，但无法改变代码运行的时机。比如express的middleware是在一个请求到达和服务端的响应产生之间调用。而Redux的middleware是在dispatch一个action，和action到达reducer之间调用。
2. middleware允许链式调用。意思是我们可以注册多个middleware，框架会按照顺序依次调用我们的middleware。
3. 如果我们注册了middleware，那么我们在之后每次dispatch的时候都会把所有*middleware*都走一遍。

**如何使用？**

学习一项技术最好的方式就是使用它。很多时候我们听了很多理论，看了很多遍源码，但还是不知道它在干什么。这个时候我们如果可以看一下作为用户是如何使用这项技术的，对理解它为什么存在以及为什么那样实现会非常有帮助。Redux的middleware就是这样的技术，如果你直接去读源码，其实代码量很少，但就是不知道它在干嘛。如果去看几个实际的应用案例，对理解的帮助会非常大。我们首先来看一下，如果我们要注册一个middleware，代码应该如何写呢？伪代码如下：

```js
import { compose, createStore, applyMiddleware } from 'redux';

// 假如我们要注册两个middleware: middleware1和middleware2
const enhancer = applyMiddleware(middleware1, middleware2);
const store = createStore(reducers, enhancer);
```

在以上代码中，我们在调用createStore创建store的时候注册了两个middleware。我们调用了redux暴露出来的applyMiddleware函数，它返回一种成为storeEnhancer的函数。然后我们将这个enhancer传给createStore。这样createStore会被修改，经过这样返回的store将是被插入了middleware代码的。

**原理**

以上我们知道了如何在createStore的时候使用一些已有的middlewares来实现我们的需求。那么Redux的middleware机制到底是如何执行的呢？这才是我们这篇文章想要搞懂的重点。接下来我们就一一来看一下：

1. createStore函数的enhancer参数，我们看一下createStore的源码（经过删减，重点关注它对于enhancer参数的处理）:

```js
export default function createStore(reducer, enhancer) {
 if (enhancer) {
  return enhancer(createStore)(reducer);
 } return {  // return created store
 }
}
```

可以看到，如果我们传了enhancer函数给createStore的话，那么它会调用enhancer，并传入原始的createStore函数作为参数。而我们这里的enhancer就是applyMiddleware函数，那么接下来我们看一下applyMiddleware函数的实现方式。

1. applyMiddleware的实现，为了看清楚函数调用的层级关系，我将代码中的箭头函数都改为了function的写法，并给每个函数都起了名字，我个人觉得这样更容易理解函数之间的调用关系。如果你觉得箭头函数更容易懂也可以直接看Redux的源码。

```js
export default function applyMiddleware(...middlewares) {
 // applyMiddleware返回另一个函数，也就是`enhancer`。
 // `enhancer`接受原来的createStore函数为参数.
 return function enhancer(createStore) {
 // enhancer的返回值是另一个函数，其实就是`新的createStore`
  return function enhancedCreateStore(...args) {
 // 调用老的createStore，来获得store。
  const store = createStore(...args)
 // 定义新的dispatch函数，后边会被修改
 let dispatch = () => {
  throw new Error('Dispatching while constructing your middleware is not allowed.Other middleware would not be applied to this dispatch.')
 }
 // 暴露个每个middleware的API。
 const middlewareAPI = {
  getState: store.getState,
 dispatch: (...args) => dispatch(...args)
 }
 // 把所有传入的middlewares转为一个数组。
 const chain = middlewares.map(function(middleware) {
  return middleware(middlewareAPI)
 })
 // 新的dispatch函数，其实就是把所有middleware的调用链加入dispatch的执行过程中。
 dispatch = compose(...chain)(store.dispatch)
 // 新的createStore的返回值，其实唯一变化的就是dispatch字段。
 return {
  ...store,
 dispatch,
 }
 }
 }
}
```

以上我们详细解释了applyMiddleware每一行代码的执行过程。可以看到，所谓执行middleware，其实也就是将原来的dispatch函数替换为会遍历执行所有*middleware*的新的dispatch函数。那么在执行过enhancer后，在我们的代码中拿到的store.dispatch函数就是经过修改的新的dispatch函数了，结果就是我们每次调用dispatch都会走一遍所有middlewares。
上面我们知道了所有middlewares函数会被链接到一起然后顺序执行，那么这具体是如何做到的呢？我们需要看一下compose函数的实现：

1. compose函数:

```js
export default function compose(...funcs) {
 if (funcs.length === 0) {
 return arg => arg
 }
 
 if (funcs.length === 1) {
 return funcs[0]
 }
 
 return funcs.reduce(function reducer(a, b) {
 return function (...args) {
 return a(b(...args))
 }
 })
}
```

前两个if条件主要用于处理一些边界条件，不是主要内容，可以先忽略。函数的主体就是funcs.reduce的部分。所以要理解这个函数，就必须理解array.reduce函数。根据文档：

> The reduce() method executes a reducer function (that you provide) on each member of the array resulting in a single output value.

它的执行过程就是对funcs数组中的每个元素调用reducer。那么我们接下来看一下reducer的两个参数a和b分别代表什么呢？在reducer函数中：

- 第一个参数表示accumulator，它的值是上一次调用*reducer*的返回值
- 第二个参数表示currentValue，表示数组当前遍历到的元素

所以，b就是当前正在遍历的函数，a表示上一次调用结果，也就是每一次迭代到下一个元素a就会被更新为上次调用的结果。

现在我们用一个示例来测试一下compose的执行过程，假设我们有三个函数，分别如下:

```js
import { compose } from 'redux'
function fun1(n) {
 console.log('fun1: ', n)
 return 1
}
function fun2(n) {
 console.log('fun2: ', n)
 return 2
}
function fun3(n1, n2, n3) {
 console.log('fun3: ', n1, n2, n3)
 return 3
}
const fun = compose(fun1, fun2, fun3)
fun('a', 'b', 'c')
```

执行上面的代码，将得到以下输出：

```text
fun3: a b c
fun2: 3
fun1: 2
```

也就是说，compose接受N个函数作为输入参数，然后将这些函数依次从右向左执行，并把每个函数的返回值作为参数传入下一个被调用的函数中，也就是把所有函数的调用"串联"了起来。也就是相当于这样写：

```js
fun1(fun2(fun3('a', 'b', 'c')))
```

需要注意的是，除了最右的函数外，其他函数都只接受一个参数(也就是上一个函数的返回值)。而最右侧的函数是可以接受任意参数的，因为它是作为整个compose返回函数的签名（它的参数是外部调用的时候传入的）。

**整体流程**

上面主要介绍了applyMiddleware的过程，这一步通常是在程序启动的时候执行一次。那么接下来我们看一下middleware的整体执行过程，假设我们有以下middlewares：

```js
const logger = middlewareAPI => next => action => {
 console.log('start dispatch: ', action)
 let result = next(action)
 console.log('next state: ', store.getState())
 return result
}
const errorHandler = middlewareAPI => next => action => {
 try {
  return next(action)
 } catch (err) {
  // handle error
 }
}
// dummy reducer
function reducer() {}
const store = createStore(reducer, applyMiddleware(errorHandler, logger))
store.dispatch({ type: 'test' })
```

以上我们定义了两个middleware，分别是logger和errorHandler。代码执行流程如下：

1. 执行applyMiddleware，首先会调用每个middleware函数，然后将middlewareAPI作为参数传入。middleware返回一个函数，这里才是真正的middleware的执行体，也就是：next => action => {}的部分。然后代码会通过compose将所有middleware组成一条调用链，依次执行。

这里有个问题需要注意一下，就是原始的dispatch在什么时候执行？根据applyMiddleware.js中的代码：

```js
compose(...chain)(store.dispatch)
```

在我们上面的例子中，这句代码相当于：

```js
errorHandler(logger(store.dispatch))
```

这句代码的执行顺序是：首先执行logger，然后遇到next(action)的代码，接着执行errorHandler，最后执行原始的store.dispatch。

1. 执行createStore，由于我们传递了enhancer参数，会返回带有中间件的store（替换dispatch函数)。
2. 我们在代码中调用store.dispatch，这时拿到的dispatch函数是被修改过的，串联了middleware的。所以会按照第一步中所描述的过程，依次执行所有middleware，最后执行原始的store.dispatch函数。