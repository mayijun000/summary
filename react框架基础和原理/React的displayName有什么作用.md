# React的displayName有什么作用?

## displayName:定义调试时的组件name

例如：



```jsx
 function withHOC(WrapComponent) {
   // 此处未定义名称或者希望动态定义名称
   return class extends React.Component {
     // 定义displayName
     static displayName = `withHOC(${WrapComponent.displayName || WrapComponent.name})`;
     render(){
       console.log("inside HOC")
       return <WrapComponent {...this.props } />;
     }
   }
 }

 App = withHOC(App);
```

如果未定义displayName，那么进行调试的时候，就会显示如下：



```cpp
// react自动定义名称
|---_class2
  |---App
    ...
```

定义displayName后，显示如下：



```ruby
|---withHOC(App)
  |---App
    ...
```

