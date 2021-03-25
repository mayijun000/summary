# React 之 Portals 插槽

插槽：将一个React元素渲染到指定的Dom容器中

`ReactDOM.createPortal(React元素, 真实的DOM容器)`，该函数返回一个React元素

第一个参数（`child`）是任何[可渲染的 React 子元素](https://link.zhihu.com/?target=https%3A//zh-hans.reactjs.org/docs/react-component.html%23render)，例如一个元素，字符串或 fragment。

第二个参数（`container`）是一个 DOM 元素。

```text
import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Portals extends Component {
  render() {
    return (
      <div
        onClick={() => {
          console.log("rooter click");
        }}
      >
        <p>我想出现在root中</p>
        <Test />
      </div>
    );
  }
}

function Test() {
  return ReactDOM.createPortal(
    <ChildA />,
    //     <h1>我想出现在container中</h1>,
    document.getElementById("container")
  );
}

function ChildA() {
  return <p>我是childA</p>;
}
```

![img](https://pic3.zhimg.com/80/v2-145046a10b34e9bc95a2623f64d180a6_720w.jpg)



### **注意**

1.React中的事件是包装过的

2.它的事件冒泡是根据虚拟DOM树来冒泡，与真实的DOM树无关