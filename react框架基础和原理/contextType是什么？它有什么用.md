# contextType是什么？它有什么用

定义当前组件要使用哪一个context

```js
const MyContext = React.createContext(defaultValue);

class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```