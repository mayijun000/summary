# componentWillUpdate可以直接修改state的值吗

### 不行，这样会导致无限循环报错。

react组件在每次需要重新渲染时候都会调用`componentWillUpdate()`,

例如，我们调用 `this.setState()`时候

在这个函数中我们之所以不调用`this.setState()`是因为该方法会触发另一个`componentWillUpdate()`,如果我们`componentWillUpdate()`中触发状态更改,我们将以无限循环结束.