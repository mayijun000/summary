# React的严格模式有什么用处

react的strictMode 是一个突出显示应用程序中潜在问题的工具，与Fragment一样，strictMode 不会渲染任何的可见UI，它为其后代元素触发额外的检查和警告。

注意：严格模式仅在开发模式下运行，它们不会影响生产构建

可以为程序的任何部分使用严格模式

```
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

在上述的示例中，不会对 Header 和 Footer 组件运行严格模式检查。但是，ComponentOne 和 ComponentTwo 以及它们的所有后代元素都将进行检查。

StrictMode 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API