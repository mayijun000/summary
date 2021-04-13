# React创建组件的三种方式及其区别是什么

## 1、介绍

我们从相关的知识知道，在React推出后，出于不同的原因先后出现三种定义react组件的方式，殊途同归；具体的三种方式：

- 函数式定义的无状态组件
- es5原生方式React.createClass定义的组件
- es6形式的extends React.Component定义的组件

下面就简单介绍一下这三种定义组件方式有什么不同或者说为什么说会出现对应的定义方式。

## 2. 函数式定义的无状态组件

创建纯展示组件，只负责根据传入的props来展示，不涉及到要state状态的操作，是一个只带有一个render方法的组件类

创建形式如下：

```html
<div id="example"></div>
 
<script type="text/babel"> 

function FancyBorder(props) { 

return ( 

<div className={'FancyBorder FancyBorder-' + props.color}> 

{props.children} 

</div>

); 

} 

function WelcomeDialog() { 

return ( 

<FancyBorder color="blue"> 

<h1 className="Dialog-title"> 

Welcome 

</h1> 

<p className="Dialog-message"> 

Thank you for visiting our spacecraft! 

</p> 

</FancyBorder> 

); 

} 

ReactDOM.render( 

<WelcomeDialog />, 

document.getElementById('example') 

); 

</script>
```

**特点：**

- 组件不会被实例化，整体渲染性能得到提升
- 组件不能访问this对象
- 组件无法访问生命周期的方法
- 无状态组件只能访问输入的props，同样的props会得到同样的渲染结果，不会有副作用

无状态组件使得代码结构更加清晰，减少代码冗余，在开发过程中，尽量使用无状态组件

## 3. React.createClass

`React.createClass`是react刚开始推荐的创建组件的方式，这是ES5的原生的JavaScript来实现的React组件，其形式如下：

是ES5的原生的JavaScript来实现的React组件

该例子实现了一个交互列表，用户输入信息，按回车后触发键盘事件将获取到的输入值渲染生成列表项，输入信息的数量可以是任意多个。

```html
<div id="example"></div> 

<script type="text/babel"> 

var HelloMessage = React.createClass({ 

render: function() { 

return <h1>Hello {this.props.name}</h1>; 

} 

}); 

ReactDOM.render( 

<HelloMessage name="John" />, 

document.getElementById('example') 

);
```

**特点：**

- React.createClass会自绑定函数方法导致不必要的性能开销
- React.createClass的[mixins](https://link.zhihu.com/?target=https%3A//link.jianshu.com/%3Ft%3Dhttps%3A//hulufei.gitbooks.io/react-tutorial/mixin.html)不够自然、直观

ps：React 版本16以后，React.createClass({})创建组件的方式失效。

## 4.React.Component

React.Component是以ES6的形式来创建react的组件的，是React目前极为推荐的创建有状态组件的方式，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。

```css
class Contacts extends React.Component { 

constructor(props) {

 super(props); 

} 

handleClick() {

     console.log(this); // null 

} 

render() { 

 return ( <div onClick={this.handleClick}></div> );

 }
```

## 5.关于this

React.createClass创建的组件，其每一个成员函数的this都有React自动绑定，任何时候使用，直接使用this.method即可，函数中的this会被正确设置

React.Component创建的组件，其成员函数不会自动绑定this，需要手动绑定，否则this不能获取当前组件实例对象

React.Component三种手动绑定this的方法

- 在构造函数中绑定

```css
constructor(props) { super(props); this.Enter = this.Enter.bind(this); }
```

- 使用bind绑定<div onKeyUp={this.Enter.bind(this)}></div>
- 使用arrow function绑定<div onKeyUp={(event)=>this.Enter(event)}></div>
  我们在实际应用中应该选择哪种方法来创建组件呢？
- 只要有可能，尽量使用无状态组件创建形式
- 否则（如需要state、生命周期方法等），使用React.Component这种es6形式创建组件