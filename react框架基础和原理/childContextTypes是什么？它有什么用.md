# childContextTypes是什么？它有什么用

childContextTypes用来定义context数据类型，该api从16.3开始已被废弃

使用方式

```js
class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    return <div>MessageList</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```