# redux-saga入门

## **开始使用**

### **安装**

要使用任何一个npm的库，第一步都是先安装，可以使用npm或者yarn：

```text
> npm install --save redux-saga
```

或者：

```text
yarn add redux-saga
```

### **注册middleware**

和`redux-thunk`一样，`redux-saga`也是一个redux的middleware。所以首先要使用applyMiddleware来注册middleware：

```text
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import mySaga from './sagas'

// 创建saga middleware
const sagaMiddleware = createSagaMiddleware()
// 通过applyMiddleware将redux-saga注册到store中
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
// 运行saga
sagaMiddleware.run(mySaga)
```

和`redux-thunk`相比，`redux-saga`多了一步调用`.run`的操作。
通过以上代码，即完成`redux-saga`的注册和启动工作。接下来主要是`saga`的编写，也就是处理具体业务逻辑的地方了。

## **核心概念**

### **saga**

看到*saga*这个词我们可能会感觉比较陌生，那么在`redux-saga`中到底什么是一个*saga*呢？

1. saga首先必须是一个`generator`，也就是使用`function *`的语法来定义的，虽然它使用`function`的关键字，但和普通的函数完全不同。如果你对`generator`的概念不熟悉，建议先去看一下相关文档，因为`generator`是使用`redux-saga`所必不可少的。
2. 一个saga可以启动其他的saga。

saga其实可以理解为就是一项任务，通常一项任务要分多个步骤完成，每个步骤我们都可以封装为一个小的独立的saga，然后调用不同的saga来完成特定的一项任务。

### **Effect**

Effect就是一些普通的*plain Object*，这一点十分重要，因为它保证了`redux-saga`代码的可测试性。

我们可以通过`redux-saga`提供的一系列*effect-creator*函数来创建这些Effect，这些函数包括：`put`,`call`,`take`等。然后在saga中用`yield`关键字来执行这些Effect。

Effect可理解为我们发出的想要执行某项操作的指令（比如调用函数、请求API等），注意仅仅是*发出指令*，而具体操作的执行是由`redux-saga`的底层来处理的。比如以下代码：

```text
import { call } from 'redux-saga/effects'
function *fetchItems() {
  yield call(Api.fetchItems)
}
```

我们把想要调用的函数传给`call`，但这并不会导致我们的函数被*直接*调用。我们只是发出了想要调用这个函数的指令，而函数的执行是由`redux-saga`的middleware来处理的。
这样做主要是为了方便写unit test。

### **总结**

一个Saga可以简单理解为是一个函数，我们通过将一项复杂的流程拆分成多个小的函数来组织代码。我们通过yield关键字来调用Effect从而达到执行具体操作的目的。

我们可以通过if,while等普通的流程控制方法来控制Effect的流程，也可以通过try/catch的方式来处理异常。

## **编写saga**

接下来我们来看一个saga的实例代码，假设我们有一个按钮，点击按钮会发出API请求，API请求返回之后我们需要往redux store中存入数据。

*注册middleware的部分可以参考前面代码，这里代码就省略了。以下代码为伪代码，主要表达概念，无法直接运行*

saga.js

```text
import { call, put, takeEvery } from 'redux-saga/effects'
import Api from '...'

// 用于API请求的saga
function* fetchBooks() {
   // 使用普通的try/catch来处理函数
   try {
      // 调用call发起API请求
      const books = yield call(Api.fetchBooks);
      // 调用put将结果存入redux store
      yield put({type: "BOOK_FETCH_SUCCEEDED", books: books});
   } catch (e) {
   		// 错误信息，存入redux store
      yield put({type: "BOOK_FETCH_FAILED", message: e.message});
   }
}

// 入口saga
function* mySaga() {
  // 监听BOOK_FETCH_REQUESTED类型的action，如果监听到就发出API请求
  yield takeEvery("BOOK_FETCH_REQUESTED", fetchBooks);
}

export default mySaga;
```

component.js

```text
// 按钮点击的处理函数
function handleClick() {
  // 这里就是正常的dispatch一个普通的plain object
  store.dispatch({ type: 'BOOK_FETCH_REQUESTED' })
}
const Button = (<button onClick={handleClick}>
Fetch Books
</button>
)
```

下面对代码做一下解读：

1. 上面我们在`component.js`中定义了一个Button组件，当点击Button被点击的时候，我们会调用普通的store.dispatch，然后传入一个普通的action object（如果是redux-thunk这里需要dispatch一个function才行）
2. 由于我们在mySaga中使用了`takeEvery`，相当于注册了一个监听器，所有`BOOK_FETCH_REQUESTED`类型的action都会被劫持。然后`redux-saga`会调用我们传入的`fetchBooks`函数(generator)。
3. 在`fetchBooks`中，我们使用`yield call`的方式发出函数调用，真正的API请求在`Api.fetchBooks`中，`redux-saga`会帮我们调用它。
4. 请求的结果返回后，如果成功，我们会使用`yield put`来dispatch一个普通的action: `BOOK_FETCH_SUCCEEDED`，同样的，如果失败，我们会dispatch `BOOK_FETCH_FAILED`。
   这里注意，`put`就相当于直接调用store.dispatch，区别就是它不会直接调用`dispatch`，而是发起一个调用请求，真正的调用由middleware底层处理
5. `BOOK_FETCH_SUCCEEDED`或`BOOK_FETCH_FAILED`的action到底redux进行分发，但由于我们的saga并没有监听这两种类型的action，所以它们会根据正常的dispatch流程进入reducer。
   我们需要在reducer中对这两种类型的action进行处理，将数据存入store中。