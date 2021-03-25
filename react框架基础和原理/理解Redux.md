# 理解Redux

由于React并没有官方的状态管理机制，Redux其实是React事实上的状态管理工具，我也是在使用React的过程中学习的Redux。但是Redux其实只是一个简单的纯JS的库，理论上可以应用在任何的JS程序中。在实践中通常是与React配合的。与React配合还需要另一个库react-redux，是一个'binding'来把React和Redux集成到一块工作。

这篇文章我不打算介绍和React相关的东西，只是单纯介绍Redux这个库本身的工作机制。



**理解Redux的钥匙**

其实如果你查看Redux的源码的话，会发现它的代码量远比文档的数量要少。它的概念性的东西比较多，代码比较短小精悍，想要彻底理解Redux我觉得比较好的方法是文档和代码对照着看，看文档可以帮你理解它的一些概念，看代码才能知道这些概念是如何 工作在一起的，加强对概念的理解。

我这篇文章算是在官网文档的基础上加上我个人对它的理解，真的要深入学习还是推荐大家把官网文档通读一遍，再去看它的代码，这样理解会比较深刻。

好，接下来就给大家介绍一下Redux中比较核心的几个概念和API，这也是通往Redux的密室的几把钥匙：

- **store**
  在上一篇文章中我们讲过前端状态的概念，所谓状态，可以理解为就是一堆变量的集合。Redux作为一个“前端状态管理器”，它自然需要有一个地方存储这些状态。store就是它存储状态的地方。任何使用Redux的程序第一步就是通过它提供的 createStore函数来创建一个store，store中包含了如何获取当前状态和修改状态的方法，我们后续就会讲到。
- **reducer**
  reducer是我们传给createStore的一个函数，用来表示我们的状态可以被执行哪些操作。它是一个纯函数，所谓纯函数是指根据一个函数输入在任意时间和任意情况下都只会有一种确定的输出。在Redux中，一个reducer会接受两个参数:previousState(老的状态数据)和action(在何种操作下)，返回newState(返回新的状态数据)。用代码表示如下：

```js
function reducer(previousState, action) {
 // 根据不同情况返回不同d的newState
 // 默认情况返回的就是初始化的state
 return newState;
}
```

- **action**
  如果说reducer定义了我们的状态可以如何被改变，那么action就是我们可以对状态做哪些改变。在实践中，action通常被定义为一系列的const常量，然后在reducer中通过判断不同的action来返回不同的newState。一个标准的action是一个对象，通常包含type和payload两个字段，分别表示发起了什么类型的操作以及操作所携带的数据。
- **dispatch**
  dispatch可以理解为一个动词，就是我们真正发起状态改变的地方。通常在网络请求的回调处理函数中，我们会使用dispatch来发起对状态的修改操作，进一步使前端的UI发生更新。
- **subscribe**
  当状态发生改变我们通常需要得到通知，然后去更新UI或做其他操作。subscribe 函数就提供了这样一个机会，我们传入一个自己定义的回调函数(listener)，然后Redux就会在下一次状态被更新的时候调用我们的listener。
- **getState**
  为了防止状态被随意改变，Redux的state我们是无法直接拿到的，如果需要访问state，Redux为我们提供了getState函数，可以获取整个的state数据。

现在我们可以简单总结一下Redux的工作流程：

首先，我们通过createStore可以创建一个store，也就是状态管理器的对象。store中包含了状态本身以及我们对状态做修改操作的方式。

我们通过传给createStore的reducer函数来定义我们的状态的数据结构，以及状态在何种操作下会做何种改变。

dispatch和action是分不开的两个概念，可以理解为一个是动词一个是名词。当我们要修改状态的时候，不能直接修改状态，而是需要通过调用dispatch函数，传入我们想要的action，然后由Reducer来帮我们完成状态的修改。

dispatch函数到了Redux内部，Redux就会调用我们的reducer，然后把dispatch收到的action传给reducer。我们的reducer会根据不同的action返回不同的新的state。Redux把reducer返回的newState更新为我们新的状态，就完成了状态的修改。

状态修改之后，如果我们通过subscribe注册过listener监听器函数，Redux就会依次调用我们的listener。通常在listener中可以做一些UI重新渲染之类的工作。

**一些坑**

reducer虽然看起来比较简单，但在一个复杂的程序中也是坑比较多的地方。

首先，reducer要求必须是一个“纯函数”，也就是不要调用任何可能引起副作用的操作，如发起网络请求等。

另外要求reducer的返回值必须是一个新的对象，它的previousState参数一定不能被修改。容易犯错的也就是这里，我们经常会无意间对previousState做了修改。reducer中对state的操作注意一定要使用non-destructive的函数和语法。这个问题我不打算在这篇文章里做过多介绍，计划以后专门出一篇文章盘点一下JS中对对象做non-destructive的方式，如果你感兴趣，欢迎关注我的个人公众号:<前端时光机>。

写reducer还有一个比较核心的问题，就是state数据结构的规划。我们应该尽量避免嵌套的数据结构，而应该尽量定义为扁平的数据结构，这个思想其实有点类似于关系型数据库（如MySQL）的数据组织方式。这一部分也值得一篇专门的文章来讨论，就不在这里详细论述了。



**总结**

在这篇文章中，我们主要介绍了Redux的几个主要的概念和API。看完本篇文章，你应该对Reducer的工作流程有个大概的了解，建议去看看Redux的源码来加深了解。其实Redux的源码并不是很多，有了这些概念理解的基础还是比较容易看懂的。