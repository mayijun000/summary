# react中生命周期

大部分团队不见得会跟进升到16版本，所以16前的生命周期还是很有必要掌握的，何况16也是基于之前的修改。所以我们会针对 v16.0 之前 和 v16.x的维度去介绍

## **组件生命周期的三个阶段**

### **Mounting（加载阶段）**

> Some methods are called in the following order when an instance of a component is being created and inserted into the DOM.

### **Updating（更新阶段）**

> An update can be caused by changes to props or state. Some methods are called in the following order when a component is being re-rendered.

### **Unmounting（卸载阶段）**

> When a component is being removed from the DOM.

## **旧的生命周期(v16.0之前)**

![img](https://pic4.zhimg.com/80/v2-cabff0485e5201c38a576d27483af413_720w.jpg)

### **Mounting（加载阶段：涉及6个钩子函数）**

- constructor() 加载的时候调用一次，可以初始化state
- getDefaultProps() 设置默认的props，也可以用dufaultProps设置组件的默认属性
- getInitialState() 初始化state，可以直接在constructor中定义this.state
- componentWillMount() 组件加载时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state
- render() react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行
- componentDidMount() 组件渲染之后调用，只调用一次

### **Updating（更新阶段：涉及5个钩子函数)**

- componentWillReceiveProps(nextProps) 组件加载时不调用，组件接受新的props时调用
- shouldComponentUpdate(nextProps, nextState) 组件接收到新的props或者state时调用，return true就会更新dom（使用diff算法更新），return false能阻止更新（不调用render）
- componentWillUpdata(nextProps, nextState) 组件加载时不调用，只有在组件将要更新时才调用，此时可以修改state
- render() react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行
- componentDidUpdate() 组件加载时不调用，组件更新完成后调用

### **Unmounting（卸载阶段：涉及1个钩子函数）**

componentWillUnmount()

> 组件即将卸载前调用，只调用一次

### **基础写法**

```text
import React, { Component } from 'react'

export default class ReactComponent15 extends Component {
    constructor(props) {
        super(props)
        // getDefaultProps：接收初始props
        // getInitialState：初始化state
    }
    state = {

    }
    componentWillMount() { // 组件挂载前触发

    }
    render() {
        return (
            <h2>Old React.Component</h2>
        )
    }
    componentDidMount() { // 组件挂载后触发

    }
    componentWillReceiveProps(nextProps) { // 接收到新的props时触发

    }
    shouldComponentUpdate(nextProps, nextState) { // 组件Props或者state改变时触发，true：更新，false：不更新
        return true
    }
    componentWillUpdate(nextProps, nextState) { // 组件更新前触发

    }
    componentDidUpdate() { // 组件更新后触发

    }
    componentWillUnmount() { // 组件卸载时触发

    }
}
```

## **新的生命周期(v16.x)**

- static getDerivedStateFromProps(props, state)
- getSnapshotBeforeUpdate(prevProps, prevState)

> static getDerivedStateFromProps(props, state)
> 组件每次被re-render的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后；每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state；配合componentDidUpdate，可以覆盖componentWillReceiveProps的所有用法
>
> getSnapshotBeforeUpdate(prevProps, prevState)
> 触发时间: update发生的时候，在render之后，在组件dom渲染之前；返回一个值，作为componentDidUpdate的第三个参数；配合componentDidUpdate, 可以覆盖componentWillUpdate的所有用法

### **Mounting（加载阶段：涉及4个钩子函数）**

- constructor() 加载的时候调用一次，可以初始化state
- static getDerivedStateFromProps(props, state) 新的生命周期
- render() react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行
- componentDidMount() 组件渲染之后调用，只调用一次

> Note:
> These methods are considered legacy and you should avoid them in new code: **[UNSAFE_componentWillMount()](https://link.zhihu.com/?target=https%3A//reactjs.org/docs/react-component.html%23unsafe_componentwillmount)**

### **Updating（更新阶段：涉及5个钩子函数)**

- static getDerivedStateFromProps(props, state) 新的生命周期
- shouldComponentUpdate(nextProps, nextState) 组件接收到新的props或者state时调用，return true就会更新dom（使用diff算法更新），return false能阻止更新（不调用render）
- render() react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行
- getSnapshotBeforeUpdate(prevProps, prevState) 新的生命周期
- componentDidUpdate() 组件加载时不调用，组件更新完成后调用

> Note:
> These methods are considered legacy and you should avoid them in new code:

- **[UNSAFE_componentWillUpdate()](https://link.zhihu.com/?target=https%3A//reactjs.org/docs/react-component.html%23unsafe_componentwillupdate)**
- **[UNSAFE_componentWillReceiveProps()](https://link.zhihu.com/?target=https%3A//reactjs.org/docs/react-component.html%23unsafe_componentwillreceiveprops)**

### **Unmounting（卸载阶段：涉及1个钩子函数）**

componentWillUnmount()

> 组件即将卸载前调用，只调用一次

### **Error Handling(错误处理)**

- static getDerivedStateFromError()
- componentDidCatch(error，info)

> These methods are called when there is an error during rendering, in a lifecycle method, or in the constructor of any child component

### **基本用法**

```text
import React, { Component } from 'react'

export default class ReactComponent16 extends Component {
    constructor(props) {
        super(props)
        // getDefaultProps：接收初始props
        // getInitialState：初始化state
    }
    state = {

    }
    static getDerivedStateFromProps(props, state) { // 组件每次被rerender的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后；;每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
        return state
    }
    componentDidCatch(error, info) { // 获取到javascript错误

    }
    render() {
        return (
            <h2>New React.Component</h2>
        )
    }
    componentDidMount() { // 挂载后
        
    }   
    shouldComponentUpdate(nextProps, nextState) { // 组件Props或者state改变时触发，true：更新，false：不更新
        return true
    }
    getSnapshotBeforeUpdate(prevProps, prevState) { // 组件更新前触发

    }
    componentDidUpdate() { // 组件更新后触发

    }
    componentWillUnmount() { // 组件卸载时触发

    }
}
```

## **总结**

### **旧的生命周期**

![img](https://pic1.zhimg.com/80/v2-3d2863ad91b277a478c4b02e4a4de9b4_720w.jpg)

### **新的生命周期**

![img](https://pic1.zhimg.com/80/v2-19fcc8e902def5e0ff71df69934cd11c_720w.jpg)

React16新的生命周期弃用了componentWillMount、componentWillReceiveProps，componentWillUpdate 新增了getDerivedStateFromProps、getSnapshotBeforeUpdate来代替弃用的三个钩子函数（componentWillMount、componentWillReceiveProps，componentWillUpdate） React16并没有删除这三个钩子函数，但是不能和新增的钩子函数（getDerivedStateFromProps、getSnapshotBeforeUpdate）混用，React17将会删除componentWillMount、componentWillReceiveProps，componentWillUpdate 新增了对错误的处理（componentDidCatch）