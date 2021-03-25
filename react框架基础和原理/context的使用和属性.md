# context的使用和属性

## **context**

1.组件创建上下文之后，上下文中的数据会被所有的后代组件共享

2.组件依赖上下文，会导致组建不再纯粹依赖state和props



### **旧的api**

### **创建上下文**

只有类组件才可以创建上下文

1.给类组件书写静态属性`childContextTypes`，使用该属性对上下文中的数据类型进行约束

2.添加实例方法 `getChildContext`，该方法返回的对象，即为上下文中的数据，该数据必须满足类型的约束，该方法会在每次`render`之后运行。

```js
const types = {
  a: PropTypes.number,
  b: PropTypes.string
};
export default class OldContext extends React.Component {
    
  static childContextTypes = types;

 state = {
    a: 0
  };

  getChildContext() {
      console.log("获取context");
    return {
      a: 111,
      b: "abc"
    };
  }
  render() {
    return (
      <div>
        <p>hello word</p>
            <button
          onClick={() => {
            this.setState({
              a: this.state.a + 1
            });
          }}
        >
          click
        </button>
      </div>
    );
  }
}
```

> 经测试发现，`getChildContext`方法是在`render`函数执行之后触发

![img](https://pic4.zhimg.com/80/v2-692b09140769fc794dd68cc9a197cccf_720w.png)



### **使用上下文中的数据**

要求：组件使用上下文中的数据，组件中必须有一个静态属性`contextTypes`，该属性描述了上下文中需要使用的数据类型

获取：1.可以在组件的构造函数中，通过第二参数，获取上下文数据;

2.从组件的context属性中获取（this.context）

\3. 函数组件中，通过第二参数获取上下文

```js
// 函数组件的获取方式
function ChildA(props, context) {
  return (
    <div>
      <h1>我是组件childA</h1>
      <p>content中的a：{context.a}</p>
      <ChildB />
    </div>
  );
}
ChildA.contextTypes = {
  a: types.a
};

// 类组件的两种方式：
// 1.直接通过this.context属性获取
class ChildB extends React.Component {
  static contextTypes = types;
  render() {
    return (
      <div>
        <h1>我是组件B</h1>
        <p>content中的a：{this.context.a}</p>
        <p>content中的b：{this.context.b}</p>
        <ChildC />
      </div>
    );
  }
}

//2.通过constructor构造函数的第二参数获取
class ChildC extends React.Component {
  static contextTypes = types;

  constructor(props, context) {
    super(props, context);
    console.log(context);
  }

  render() {
    return (
      <div>
        <h1>我是组件C</h1>
        <p>content中的a：{this.context.a}</p>
        <p>content中的b：{this.context.b}</p>
      </div>
    );
  }
}

```



### **上下文中的数据变化**

上下文中的数据不可以直接更改,通过状态发送变化的而发生改变

```js
const types = {
  a: PropTypes.number,
  b: PropTypes.string
};
export default class OldContext extends React.Component {
  state = {
    a: 11
  };
  static childContextTypes = types;

//　将context中的ａ的值，用state.a控制
//    当改变State改变重新触发render函数，会重新获取一次context的值
  getChildContext() {
    return {
      a: this.state.a,  
      b: "abc"
    };
  }

  render() {
    return (
      <div>
        <p>hello word</p>
        <ChildA />
        <button
          onClick={() => {
            this.setState({
              a: this.state.a + 1
            });
          }}
        >
          click
        </button>
      </div>
    );
  }
}
```



子组件中改变上下文中的数据：在上下文中的一个处理函数，可以用于后代更改上下文中数据（改变创建上下问的组件的状态）

```js
// 在创建上下问的父组件中添加一个函数,用以改变其State状态

const types = {
  a: PropTypes.number,
  b: PropTypes.string,
  onChange: PropTypes.func
};
export default class OldContext extends React.Component {
  state = {
    a: 11
  };
  static childContextTypes = types;

  getChildContext() {
    return {
      a: this.state.a,
      b: "abc",
      onChange: (name, value) => {　// 改变状态
        this.setState({
          [name]: value
        });
      }
    };
  }

  render() {
    return (
      <div>
        <p>hello word</p>
        <ChildA />
        <button
          onClick={() => {
            this.setState({
              a: this.state.a + 1
            });
          }}
        >
          click
        </button>
      </div>
    );
  }
}

//　以函数组件为例
function ChildA(props, context) {
  return (
    <div>
      <h1>我是组件childA</h1>
      <p>content中的a：{context.a}</p>
      <button
        onClick={() => {
          context.onChange("a", context.a + 1);
        }}
      >
        改变context值
      </button>
      <ChildB />
    </div>
  );
}

ChildA.contextTypes = {
  a: types.a,
  onChange: types.onChange
};
```



## **新版 api**

旧版存在严重的效率问题，容易滥用

### **创建上下文**

上下文是一个独立于组件的对象，该对象通过`React.createContext(default)`创建,返回的是一个包含两个属性的对象

１.Provider属性：一个组建，改组件会创建一个上下文，该组建有一个value属性，为上下文赋值

同一个Provider属性，不要用到多个组件中，如果需要在其他组件中使用该数据，应该考虑将数据提升到更高的层次

２.Consumer属性



### **使用上下文中的数据**

1.在类组件中，直接使用`this.context`获取上下文数据

要求：必须有一个静态属性`contextTypes`，应赋值为创建的上下文对象

2.在函数组件(或类组件)中，需要使用Consumer来获取上下文数据

1.Consumer是一个组件

　2.它的子节点，是一个函数（上下文作为该函数的参数，返回值会被渲染到页面）



### **完整示例**

```js
import React, { Component } from "react";

const ctx = React.createContext();

export default class NewContext extends Component {
  state = {
    a: 11,
    onChange: newA => {
      this.setState({
        a: newA
      });
    }
  };
  render() {
    return (
      <ctx.Provider value={this.state}>
        <button
          onClick={() => {
            this.setState({
              a: this.state.a + 1
            });
          }}
        >
          父组件改变state值
        </button>
        <p>NewContext组件：</p>
        <ChildA />
        <ChildB />
        <ChildC />
      </ctx.Provider>
    );
  }
}

//　类组件有两种方式
// 1. ----------------------------
class ChildA extends Component {
  static contextType = ctx;
  render() {
    return (
      <div>
        <p>组件ChildA:</p>
        <p>context：{this.context.a}</p>
        <button
          onClick={() => {
            this.context.onChange(this.context.a + 1);
          }}
        >
          组件改变context值
        </button>
      </div>
    );
  }
}
// 2. ----------------------------
class ChildB extends Component {
  render() {
    return (
      <div>
        <p>组件ChildB:</p>
        <ctx.Consumer>{value => <p>context:{value.a}</p>}</ctx.Consumer>
      </div>
    );
  }
}
// 函数组件
function ChildC() {
  return (
    <div>
      <p>组件ChildC:</p>
      <ctx.Consumer>{value => <p>context:{value.a}</p>}</ctx.Consumer>
    </div>
  );
}

```



### **注意细节**

如果上下文提供者(Context.Provider)中的value属性发生变化（引用地址不同，使用Object.is比较），会导致上下文提供的所有后代元素全部重新渲染，无论该子元素是否有优化（无论shouldComponentUpdate函数返回何值）

```js
const ctx = React.createContext();

export default class NewContext extends Component {
  state = {
    a: 11
  };

  render() {
    return (
      <ctx.Provider value={this.state}>// state中的引用地址指向发生改变
        <button
          onClick={() => {
            this.setState({ });
          }}
        >
          父组件改变state值
        </button>
        <ChildA />
      </ctx.Provider>
    );
  }
}

class ChildA extends Component {
  static contextType = ctx;

  shouldComponentUpdate() {
    console.log("组件优化");　　// 根本没有打印
    return false;
  }

  render() {
    console.log("渲染childA");  
    return (
      <div>
        <p>组件ChildA:</p>
        <p>context：{this.context.a}</p>
      </div>
    );
  }
}

//　优化
export default class NewContext extends Component {
  state = {
    ctx:{
        a:2
    }
  };

  render() {
    return (
      <ctx.Provider value={this.state.ctx}>// state中的引用地址指向发生改变
      .......
      </ctx.Provider>
    );
  }
}

```