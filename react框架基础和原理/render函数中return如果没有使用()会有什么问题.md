# render函数中return如果没有使用()会有什么问题

我们在使用JSX语法书写react代码时，babel会将JSX语法编译成js，同时会在每行自动添加**分号**（；），如果`return`后换行了，那么就会变成 `return；` 一般情况下会报错：

- **Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.**

**上面这段英文翻译成中文：**

- 渲染没有返回任何内容。这通常意味着缺少return语句。或者，为了不渲染，返回null。

为了代码可读性我们一般会在return后面添加括号这样代码可以折行书写，否则就在return 后面紧跟着语句，这样也是可以的。

举两个正确的书写例子：

```js
const Nav = () => {
  return (
    <nav className="c_navbar">
      { some jsx magic here }
    </nav>
  )
}

const Nav = () => {
 return <nav className="c_navbar">
    { some jsx magic here }
  </nav>
}
```

错误的写法：

```js
const Nav = () => {
  return
    <nav className="c_navbar">
      { some jsx magic here }
    </nav>
}
```