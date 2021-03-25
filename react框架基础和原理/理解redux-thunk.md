# 理解redux-thunk

## **前言**

Redux 官方出品的 middleware 库：`redux-thunk`。
可能大部分用了 Redux 的项目都会用到`redux-thunk`，但你有没有想过这个库到底是用来干嘛的？如果我不用它行不行？这篇文章我们就来详细聊一下这个库。
其实很早之前我就看过它的代码，看到它的代码量的时候被震惊了，没想到一个 GitHub 上 Star 数过万的项目，总的代码行数只有 10 行左右（我当时看的是 1.x 版本，代码量只有 8 行）。虽然我不喜欢用代码行数来衡量一个项目，但这么少的代码量当时还是觉得挺诧异的。

## **用法**

首先，我们还是来看一下这个库的用法。`redux-thunk`是作为`redux`的 middleware 存在的，用法和普通 middleware 的用法是一样的，注册 middleware 的代码如下：

```text
import thunkMiddleware from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
```

注册后可以这样使用：

```text
// 用于发起登录请求，并处理请求结果
// 接受参数用户名，并返回一个函数(参数为dispatch)
const login = (userName) => (dispatch) => {
  dispatch({ type: 'loginStart' })
  request.post('/api/login', { data: userName }, () => {
    dispatch({ type: 'loginSuccess', payload: userName })
  })
}
store.dispatch(login('Lucy'))
```

可以看到，`redux-thunk`主要的功能就是可以让我们`dispatch`一个函数，而不只是普通的 Object。后面我们会看到，这一点改变可以给我们巨大的灵活性。
了解了如何使用，接下来我们看一下它的实现原理。

## **什么是 thunk？**

我记得我在很长的时间里都把`redux-thunk`的名字看成了`redux-thank`，理解成了感谢 redux。。。其实我觉得这个库最令人迷惑的地方之一就是它的名字。其实`thunk`是函数编程届的一个专有名词，主要用于*calculation delay*，也就是延迟计算。
用代码演示如下：

```text
function wrapper(arg) {
  // 内部返回的函数就叫`thunk`
  return function thunk() {
    console.log('thunk running, arg: ', arg)
  }
}
// 我们通过调用wrapper来获得thunk
const thunk = wrapper('wrapper arg')

// 然后在需要的地方再去执行thunk
thunk()
```

可以看到，这种代码的模式是非常简单的，以前我们可能都写过类似这样的代码，只是不知道这种代码叫做`thunk`而已。

## **redux-thunk 源码**

由于`redux-thunk`的代码量非常少，我们直接把它的代码贴上来看一下。这里我们看的是最新版的`v2.3.0`的代码：

```text
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

如果你看了前几篇文章，对 Redux 及它的 middleware 机制有所了解，那么上面这段代码是非常容易理解的。`redux-thunk`就是一个标准的 Redux middleware。
它的核心代码其实只有两行，就是判断每个经过它的`action`：如果是`function`类型，就调用这个`function`（并传入 dispatch 和 getState 及 extraArgument 为参数），而不是任由让它到达 reducer，因为 reducer 是个纯函数，Redux 规定到达 reducer 的 action 必须是一个 plain object 类型。
`redux-thunk`的原理就这么多，是不是非常简单？

## **起源**

`redux-thunk`的代码和原理非常简单，但我觉得难的部分是*为什么需要这样一个库*。关于`redux-thunk`的起源可以看一下 Redux 001 号的 issue: **How to dispatch many actions in one action creator[1]**

![img](https://pic1.zhimg.com/80/v2-52f17996a5a169964e72ca85a8c78f80_720w.jpg)



大概意思就是问如何一次性发起多个 action，然后作者回答我可以让 actionCreator 返回一个函数。然后相关的 PR 如下： **fix issue 001[2]**

![img](https://pic1.zhimg.com/80/v2-489365aacbe0715ea638ac1863603b04_720w.jpg)

那个时候`redux-thunk`还没有独立，而是写在`redux`的 action 分发函数中的一个代码分支而已。和现在的`redux-thunk`逻辑一样，它会判断如果传入的 action 是一个`function`，就调用这个函数。现在将`redux-thunk`独立出去，用 middleware 的方式实现，会让 redux 的实现更加统一。
看到这里，其实我们对`redux-thunk`感到迷惑很大部分原因就是它涉及的`thunk`等的概念比较陌生而已，其实你大可以将它的名字理解为*redux-function*，也就是它只是让 dispatch 支持函数，仅此而已。

## **为什么需要？**

现在我们理解了`redux-thunk`可以让我们 dispatch 一个 function，但是这有什么用呢？其实我觉得这是一项基础设施，虽然功能简单，但可扩展性极其强大。

比如很多时候我们需要在一个函数中写多次 dispatch。这也是上面 issue 中提到的问题。比如上面我们示例代码中，我们定义了 login 函数做 API 请求，在请求发出前我们可能需要展示一个全局的 loading bar，在请求结束后我们又需要将请求结果存储到 redux store 中。这都需要用到 redux 的 dispatch。

当然在一个函数中写多个 dispatch 只是我们可以做的事情之一，既然它是一个 function，而且并不要求像 reducer 一样是 pure function，那么我们可以在其中做任意的事情，也就是有副作用(side effect)的事情。