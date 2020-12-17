# Promise的理解和常见问题

### 1、Promise 出现的原因，或者解决了什么问题

在 Promise 出现以前，在我们处理多个异步请求嵌套时，代码往往是这样的。。。

```js
let fs = require('fs')

fs.readFile('./name.txt','utf8',function(err,data){
  fs.readFile(data, 'utf8',function(err,data){
    fs.readFile(data,'utf8',function(err,data){
      console.log(data);
    })
  })
})
```

为了拿到回调的结果，我们必须一层一层的嵌套，可以说是相当恶心了。而且基本上我们还要对每次请求的结果进行一系列的处理，使得代码变的更加难以阅读和难以维护，这就是传说中臭名昭著的**回调地狱**～产生**回调地狱**的原因归结起来有两点：

1.**嵌套调用**，第一个函数的输出往往是第二个函数的输入；

2.**处理多个异步请求并发**，开发时往往需要同步请求最终的结果。

原因分析出来后，那么问题的解决思路就很清晰了：

1.**消灭嵌套调用**：通过 Promise 的链式调用可以解决；

2.**合并多个任务的请求结果**：使用 Promise.all 获取合并多个任务的错误处理。

Promise 正是用一种更加友好的代码组织方式，解决了异步嵌套的问题。

### 2、从零开始，手写 Promise

Promise 的基本特征：

1. promise 有三个状态：`pending`，`fulfilled`，or `rejected`
2. `new promise`时， 需要传递一个`executor()`执行器，执行器立即执行；
3. `executor`接受两个参数，分别是`resolve`和`reject`；
4. promise 的默认状态是 `pending`；
5. promise 有一个`value`保存成功状态的值，可以是`undefined/thenable/promise`；
6. promise 有一个`reason`保存失败状态的值；
7. promise 只能从`pending`到`rejected`, 或者从`pending`到`fulfilled`，状态一旦确认，就不会再改变；
8. promise 必须有一个`then`方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；
9. 如果调用 then 时，promise 已经成功，则执行`onFulfilled`，参数是`promise`的`value`；
10. 如果调用 then 时，promise 已经失败，那么执行`onRejected`, 参数是`promise`的`reason`；
11. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调`onRejected`；

```js
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 存放成功的回调
    this.onResolvedCallbacks = [];
    // 存放失败的回调
    this.onRejectedCallbacks= [];

    let resolve = (value) => {
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 依次将对应的函数执行
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    } 

    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 依次将对应的函数执行
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    }

    try {
      executor(resolve,reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECTED) {
      onRejected(this.reason)
    }

    if (this.status === PENDING) {
      // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      });

      // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
      this.onRejectedCallbacks.push(()=> {
        onRejected(this.reason);
      })
    }
  }
}
```

测试一下：

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  },1000);
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)
```

控制台等待 `1s` 后输出：

```js
"success 成功"
```

ok！大功告成，异步问题已经解决了！

熟悉设计模式的同学，应该意识到了这其实是一个**发布订阅模式**，这种`收集依赖 -> 触发通知 -> 取出依赖执行`的方式，被广泛运用于发布订阅模式的实现。

### Promise 的 API

- Promise.resolve()
- Promise.reject()
- Promise.prototype.catch()
- Promise.prototype.finally()
- Promise.all()  所有都执行完才执行
- Promise.race(）其中一个执行完就开始执行