# React 16 的异常/错误处理

## **React 15 及之前的行为**

过去，组件内部的 JavaScript 异常经常阻断 React 内部状态，并导致其在下一次渲染时[触发了未知的隐藏错误](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/6895)。这些错误往往是由应用程序代码中之前的错误引起的，但 React 并未提供一种在组件内部优雅处理的方式，也不会从异常中恢复。

相关链接：

- [TypeError: Cannot read property '_currentElement' of null · Issue #4026 · facebook/react](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/4026)
- [Error: performUpdateIfNecessary: Unexpected batch number ... · Issue #6895 · facebook/react](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/6895)
- [Cannot read property 'getHostNode' of null · Issue #8579 · facebook/react](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/8579)

## **错误边界介绍**

在 UI 部分发生的 JavaScript 异常不应该阻断整个应用。为了解决这一问题，React 16 引入了“错误边界（error boundary）”这一新概念。

错误边界作为 React 组件，用以**捕获在子组件树中任何地方的 JavaScript 异常，打印这些错误，并展示备用 UI** 而非让组件树崩溃。错误边界会捕获渲染期间，在生命周期方法中以及在其整个树的构造函数中的异常。

定义一个名称为 componentDidCatch(error, info) 的新生命周期方法，则类组件会成为错误边界：

```text
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

而后可作为一个正常组件进行使用：

```text
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

componentDidCatch() 方法的作用类似于 JavaScript 的 catch {}，但仅针对组件。仅有类组件可以成为错误边界。实际上，大多数时间你会想仅声明一次错误边界组件并在整个应用中使用。

注意，**错误边界仅可以捕获组件树中的后代组件错误**。一个错误边界无法捕获其自身的错误。若错误边界在渲染错误信息时失败，则该错误会传递至上一层最接近的错误边界。而这也类似与 JavaScript 中的 catch {} 块的工作方式。

## **Live Demo**

查看 [React 16](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/10294) [beta](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/10294) [版](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/10294) 中 [关于如何声明和使用错误边界的例子](https://link.zhihu.com/?target=https%3A//codepen.io/gaearon/pen/wqvxGa%3Feditors%3D0010)。

## **在哪里放置错误边界**

错误边界的粒度完全取决于你。你可能将其包装在顶层路由组件中并为用户展示“内部异常（Something went wrong）”的信息，类似于服务端框架处理崩溃的方式。你可能也会在错误边界包装一些内部组件用以保护你的应用，不会让应用的余下部分崩溃。

## **未捕获错误的新行为**

这一改变有一个重要的意义。**在 React 16 中不是由错误边界引起的错误将会使得整个 React 组件树被卸载。**

我们曾争论过这一决定，但在我们的经验中，将异常的 UI 留在那里比完全移除它还要糟糕得多。例如，在类似 Messenger 这样的产品中留下可见的异常的 UI 可能会导致一些人将信息发送给其它人。类似地，对于支付应用来说显示错误的金额要比什么都不显示糟糕得多。

这一改变意味着迁移至 React 16，你会发现之前未留意过的应用程序存在的崩溃。添加错误边界可以让您在出现问题时提供更好的用户体验。

例如，Facebook Messenger 将边栏，信息面板，会话日志和消息输入的内容包装到单独的错误边界中。如果其中一个 UI 区域中的某些组件崩溃，其余组件将保持互动。

我们也鼓励你使用 JS 错误报告服务（或自己构建），以让你能够了解在生产环境中发生的未处理的异常，并修复它们。

## **组件栈追踪**

即使应用程序意外吞噬了这些异常，React 16 也会将渲染期间发生的所有错误都打印到控制台。除了错误消息和 JavaScript 堆栈之外，它还提供组件堆栈跟踪。现在，您可以在组件树中看到发生异常的位置：

![img](https://pic1.zhimg.com/80/v2-e8584691b04a17b51bb50d8305c9e3fc_720w.jpg)

你还可以在组件堆栈跟踪中查看文件名和行号。默认情况下，在 [创建反应”应用程序](https://link.zhihu.com/?target=https%3A//github.com/facebookincubator/create-react-app)[Create React App](https://link.zhihu.com/?target=https%3A//github.com/facebookincubator/create-react-app) 项目中默认开启：

![img](https://pic2.zhimg.com/80/v2-e579aa9f02228c475280a0662486a8f5_720w.jpg)

若你不使用 Create React App，你可以手动添加 [该插件](https://link.zhihu.com/?target=https%3A//www.npmjs.com/package/babel-plugin-transform-react-jsx-source)（babel-plugin-transform-react-jsx-source） 到你的 Babel 配置中。注意这个插件仅能在开发环境中使用，**在生产环境中要禁用这个插件。**

## **为何不使用 try** **/** **catch？**

try / catch 很棒，但它仅适用于命令式的代码：

```text
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React 组件是声明式的，并指定哪些应该渲染：

```text
<Button />
```

错误边界保留了 React 声明式的特性，同时其行为和你期望的一致。例如，即使在 componentDidUpdate 周期由组件树内部底层的 setState 导致的错误，它仍能正确地传递到最近的错误边界。