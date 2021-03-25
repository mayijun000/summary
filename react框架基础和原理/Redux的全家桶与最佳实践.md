# Redux的全家桶与最佳实践

Redux 把界面视为一种状态机，界面里的所有状态、数据都可以由一个状态树来描述。所以对于界面的任何变更都简化成了状态机的变化：

```text
(State, Input) => NewState
```

这其中切分成了三个阶段：

1. action
2. reducer
3. store

所谓的 action，就是用一个对象描述发生了什么，Redux 中一般使用一个纯函数，即 **actionCreator** 来生成 action 对象。

```js
// actionCreator => action
// 这是一个纯函数，只是简单地返回 action
function somethingHappened(data){
    return {
        type: 'foo',
        data: data
    }
}
```

随后这个 action 对象和当前的状态树 state 会被传入到 reducer 中，产生一个新的 state

```js
//reducer(action, state) => newState
function reducer(action, state){
    switch(action.type){
        case 'foo':
            return { data: data };
        default:
            return state;
    }
}
```

store 的作用就是储存 state，并且监听其变化。

简单地说就是你可以这样产生一个 store :

```js
import { createStore } from 'redux'

//这里的 reducer 就是刚才的 Reducer 函数
let store = createStore(reducer);
```

然后你可以通过 dispatch 一个 action 来让它改变状态：

```js
store.getState(); // {}
store.dispatch(somethingHappened('aaa'));
store.getState(); // { data: 'aaa'}
```

好了，这就是 Redux 的全部功能。对的，它就是如此简单，以至于它本体只有 3KB 左右的代码，因为它只是实现了一个简单的状态机而已，任何稍微有点编程能力的人都能很快写出这个东西。至于和 React 的结合，则需要 [react-redux](https://link.zhihu.com/?target=https%3A//github.com/reactjs/react-redux) 这个库，这里我们就不讲怎么用了。

## 二、Redux 的一些痛点

大体上，Redux 的数据流是这样的：

```text
界面 => action => reducer => store => react => virtual dom => 界面
```

每一步都很纯净，看起来很美好对吧？对于一些小小的尝试性质的 DEMO 来说确实很美好。但其实当应用变得越来越大的时候，这其中存在诸多问题：

1. 如何优雅地写异步代码？（从简单的数据请求到复杂的异步逻辑）
2. 状态树的结构应该怎么设计？
3. 如何避免重复冗余的 actionCreator？
4. 状态树中的状态越来越多，结构越来越复杂的时候，和 react 的组件映射如何避免混乱？
5. 每次状态的细微变化都会生成全新的 state 对象，其中大部分无变化的数据是不用重新克隆的，这里如何提高性能？

你以为我会在下面一一介绍这些问题是怎么解决的？还真不是，这里大部分问题的回答都可以在官方文档中看到：[技巧 | Redux 中文文档](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/recipes/index.html)，文档里讲得已经足够详细（有些甚至详细得有些啰嗦了）。所以下面只挑 Redux 生态圈里几个比较成熟且流行的组件来讲讲。





## 三、Redux 异步控制

官方文档里介绍了一种很朴素的异步控制中间件 [redux-thunk](https://link.zhihu.com/?target=https%3A//github.com/gaearon/redux-thunk)（如果你还不了解中间件的话请看 [Middleware | Redux 中文文档](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/advanced/Middleware.html)，事实上 redux-thunk 的代码很简单，简单到只有几行代码：

```js
function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
        }
        return next(action);
    };
}
```

它其实只干了一件事情，判断 actionCreator 返回的是不是一个函数，如果不是的话，就很普通地传给下一个中间件（或者 reducer）；如果是的话，那么把 **dispatch**、**getState**、**extraArgument** 作为参数传入这个函数里，实现异步控制。

比如我们可以这样写：

```js
//普通action
function foo(){
    return {
        type: 'foo',
        data: 123
    }
}

//异步action
function fooAsync(){
    return dispatch => {
        setTimeout(_ => dispatch(123), 3000);
    }
}
```

但这种简单的异步解决方法在应用变得复杂的时候，并不能满足需求，反而会使 action 变得十分混乱。

举个比较简单的例子，我们现在要实现『图片上传』功能，用户点击开始上传之后，显示出加载效果，上传完毕之后，隐藏加载效果，并显示出预览图；如果发生错误，那么显示出错误信息，并且在2秒后消失。

用普通的 redux-thunk 是这样写的：

```js
function upload(data){
    return dispatch => {
    	// 显示出加载效果
    	dispatch({ type: 'SHOW_WAITING_MODAL' });
    	// 开始上传
    	api.upload(data)
    	    .then(res => {
    		// 成功，隐藏加载效果，并显示出预览图
	    	dispatch({ type: 'PRELOAD_IMAGES', data: res.images });
	    	dispatch({ type: 'HIDE_WAITING_MODAL' });
	    	})
	    .catch(err => {
	    	// 错误，隐藏加载效果，显示出错误信息，2秒后消失
	    	dispatch({ type: 'SHOW_ERROR', data: err });
	    	dispatch({ type: 'HIDE_WAITING_MODAL' });
	    	setTimeout(_ => dispatch({ type: 'HIDE_ERROR' }), 2000);
	    })
    }
}
```

这里的问题在于，一个异步的 upload action 执行过程中会产生好几个新的 action，更可怕的是这些新的 action 也是包含逻辑的（比如要判断是否错误），这直接导致异步代码中到处都是 **dispatch(action)**，是很不可控的情况。如果还要进一步考虑取消、超时、队列的情况，就更加混乱了。

所以我们需要更强大的异步流控制，这就是 [GitHub - yelouafi/redux-saga: An alternative side effect model for Redux apps](https://link.zhihu.com/?target=https%3A//github.com/yelouafi/redux-saga/)。下面我们来看看如果换成 redux-saga 的话会怎么样：

```js
import { take, put, call, delay } from 'redux-saga/effects'
// 上传的异步流
function *uploadFlow(action) {
	// 显示出加载效果
  	yield put({ type: 'SHOW_WAITING_MODAL' });
  	// 简单的 try-catch
  	try{
  	    const response = yield call(api.upload, action.data);
	    yield put({ type: 'PRELOAD_IMAGES', data: response.images });
	    yield put({ type: 'HIDE_WAITING_MODAL' });
  	}catch(err){
  	    yield put({ type: 'SHOW_ERROR', data: err });
	    yield put({ type: 'HIDE_WAITING_MODAL' });
	    yield delay(2000);
	  	yield put({ type: 'HIDE_ERROR' });
  	} 	
}


function* watchUpload() {
  yield* takeEvery('BEGIN_REQUEST', uploadFlow)
}
```

是不是规整很多呢？redux-saga 允许我们使用简单的 **try-catch** 来进行错误处理，更神奇的是竟然可以直接使用 **delay** 来替代 **setTimeout** 这种会造成回调和嵌套的不优雅的方法。

本质上讲，redux-sage 提供了一系列的『副作用（side-effects）方法』，比如以下几个：

1. **put**（产生一个 action）
2. **call**（阻塞地调用一个函数）
3. **fork**（非阻塞地调用一个函数）
4. **take**（监听且只监听一次 action）
5. **delay**（延迟）
6. **race**（只处理最先完成的任务）

并且通过 Generator 实现对于这些副作用的管理，让我们可以用同步的逻辑写一个逻辑复杂的异步流。

下面这个例子出自于[官方文档](https://link.zhihu.com/?target=http%3A//yelouafi.github.io/redux-saga/docs/advanced/Channels.html)，实现了一个对于请求的队列，即让程序同一时刻只会进行一个请求，其它请求则排队等待，直到前一个请求结束：

```js
import { buffers } from 'redux-saga';
import { take, actionChannel, call, ... } from 'redux-saga/effects';

function* watchRequests() {
  // 1- 创建一个针对请求事件的 channel
  const requestChan = yield actionChannel('REQUEST');
  while (true) {
    // 2- 从 channel 中拿出一个事件
    const {payload} = yield take(requestChan);
    // 3- 注意这里我们使用的是阻塞的函数调用
    yield call(handleRequest, payload);
  }
}

function* handleRequest(payload) { ... }
```

更多关于 redux-saga 的内容，请参考[Read Me | redux-saga](https://link.zhihu.com/?target=http%3A//yelouafi.github.io/redux-saga/index.html)（中文文档：[自述 | Redux-saga 中文文档](https://link.zhihu.com/?target=http%3A//leonshi.com/redux-saga-in-chinese/)）。





## 四、提高 selector 的性能

把 react 与 redux 结合的时候，react-redux 提供了一个极其重要的方法：**connect**，它的作用就是选取 redux store 中的需要的 **state** 与 **dispatch**, 交由 **connect** 去绑定到 react 组件的 props 中：

```js
import { connect } from 'react-redux';
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

// 我们需要向 TodoList 中注入一个名为 todos 的 prop
// 它通过以下这个函数从 state 中提取出来：
const mapStateToProps = (state) => {
    // 下面这个函数就是所谓的selector
    todos: state.todos.filter(i => i.completed)
    // 其它props...
}

const mapDispatchToProps = (dispatch) => {
	onTodoClick: (id) => {
		dispatch(toggleTodo(id))
	}
}

// 绑定到组件上
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

在这里需要指定哪些 state 属性被注入到 component 的 props 中，这是通过一个叫 **selector** 的函数完成的。

上面这个例子存在一个明显的性能问题，每当组件有任何更新时都会调用一次 **state.todos.filter** 来计算 **todos**，但我们实际上只需要在 **state.todos** 变化时重新计算即可，每次更新都重算一遍是非常不合适的做法。下面介绍的这个 [reselect](https://link.zhihu.com/?target=https%3A//github.com/reactjs/reselect) 就能帮你省去这些没必要的重新计算。

你可能会注意到，**selector** 实际上就是一个『**纯函数』**：

```text
selector(state) => some props
```

**而纯函数是具有可缓存性的，即对于同样的输入参数，永远会得到相同的输出值**（如果对这个不太熟悉的同学可以参考我之前写的[JavaScript函数式编程（一） - 一只码农的技术日记 - 知乎专栏](https://zhuanlan.zhihu.com/p/21714695)，reselect 的原理就是如此，每次调用 selector 函数之前，它会判断参数与之前缓存的是否有差异，若无差异，则直接返回缓存的结果，反之则重新计算：

```js
import { createSelector } from 'reselect';

var state = {
    a: 100
}

var naiveSelector = state => state.a;

// mySelector 会缓存输入 a 对应的输出值
var mySelector = createSelector(
	naiveSelector, 
	a => {
	   console.log('做一次乘法!!!');
	   return a * a;
	}
)

console.log(mySelector(state));	// 第一次计算，需要做一次乘法
console.log(mySelector(state));	// 输入值未变化，直接返回缓存的结果
console.log(mySelector(state));	// 同上
state.a = 5;							// 改变 a 的值
console.log(mySelector(state));	// 输入值改变，做一次乘法
console.log(mySelector(state));	// 输入值未变化，直接返回缓存的结果
console.log(mySelector(state));	// 同上
```

上面的输出值是：

```text
做一次乘法!!!
10000
10000
10000
做一次乘法!!!
25
25
25
```

之前那个关于 todos 的范例可以这样改，就可以避免 todos 数组被重复计算的性能问题：

```js
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const todoSelector = createSelector(
	state => state.todos,
	todos => todos.filter(i => i.completed)
)

const mapStateToProps = (state) => {
    todos: todoSelector
    // 其它props...
}

const mapDispatchToProps = (dispatch) => {
	onTodoClick: (id) => {
		dispatch(toggleTodo(id))
	}
}

// 绑定到组件上
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

更多可以参考 [GitHub - reactjs/reselect: Selector library for Redux](https://link.zhihu.com/?target=https%3A//github.com/reactjs/reselect)





## 五、减少冗余代码

redux 中的 action 一般都类似这样写：

```js
function foo(data){
	return {
		type: 'FOO',
		data: data
	}
}

//或者es6写法：
var foo = data => ({ type: 'FOO', data})
```

当应用越来越大之后，action 的数量也会大大增加，为每个 action 对象显式地写上 type 和 data 或者其它属性会造成大量的代码冗余，这一块是完全可以优化的。

比如我们可以写一个最简单的 actionCreator：

```js
function actionCreator(type){
    return function(data){
	return {
	    type: type,
	    data: data
	}
    }
}

var foo = actionCreator('FOO');
foo(123); // {type: 'FOO', data: 123} 
```

[redux-actions](https://link.zhihu.com/?target=https%3A//github.com/acdlite/redux-actions) 就可以为我们做这样的事情，除了上面这种朴素的做法，它还有其它比较好用的功能，比如它提供的 createActions 方法可以接受不同类型的参数，以产生不同效果的 actionCreator，下面这个范例来自官方文档：

```js
import { createActions } from 'redux-actions';

const { actionOne, actionTwo, actionThree } = createActions({
  // 函数类型
  ACTION_ONE: (key, value) => ({ [key]: value }),

  // 数组类型
  ACTION_TWO: [
    (first) => first,               // payload
    (first, second) => ({ second }) // meta
  ],

  // 最简单的字符串类型
}, 'ACTION_THREE');

actionOne('key', 1));
//=>
//{
//  type: 'ACTION_ONE',
//  payload: { key: 1 }
//}

actionTwo('Die! Die! Die!', 'It\'s highnoon~');
//=>
//{
//  type: 'ACTION_TWO',
//  payload: ['Die! Die! Die!'],
//  meta: { second: 'It\'s highnoon~' }
//}

actionThree(76);
//=>
//{
//  type: 'ACTION_THREE',
//  payload: 76,
//}
```

更多可以参考 [GitHub - acdlite/redux-actions: Flux Standard Action utilities for Redux.](https://link.zhihu.com/?target=https%3A//github.com/acdlite/redux-actions)





## 六、更多

其实还有太多 Redux 生态圈中的轮子没拿出来讲，比如：

1. [GitHub - paularmstrong/normalizr: Normalizes nested JSON according to a schema](https://link.zhihu.com/?target=https%3A//github.com/paularmstrong/normalizr)（可以用于范式化状态树）
2. [GitHub - acdlite/redux-rx: RxJS utilities for Redux.](https://link.zhihu.com/?target=https%3A//github.com/acdlite/redux-rx)（用于引入 RxJS 的响应式编程思想）
3. [GitHub - acdlite/redux-promise: FSA-compliant promise middleware for Redux.](https://link.zhihu.com/?target=https%3A//github.com/acdlite/redux-promise)（Redux 中间件，用于处理 Promise）