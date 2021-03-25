# 除了实例的属性可以获取Context外哪些地方还能直接获取Context呢

```js
<!DOCTYPE html><html>
<head>
    <meta charset="utf-8" />
    <title>react demo</title>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
</head>
<body>


<div id="app"></div>


<script type="text/babel">

    /*
    * context 使用方法
     1. 创建store：通过 React.createContext 创建 AppContext 实例
     2. 包裹整个组件：使用AppContext.Provider组件
     3. 注入全局变量，在AppContext.provider组件上
     4. 引入全局变量： 通过 AppContext.Consumer组件 ，子组件的回调，获取store中的内容和方法
    * */

    const { createContext } = React;

    //创建store
    const AppContext=createContext({});

    class A  extends React.Component{
        constructor(props,context){
            super(props);
            this.state={
                a:context
            }
        }

        shouldComponentUpdate(nextProps, nextState,nextContext) {
            console.log(nextContext);
            return true;
        }


        componentDidMount() {
            console.log(this.state.a.name);
        }

        //从store中取值
        render(){
            return (
                <AppContext.Consumer>
                    {
                        (context)=>{
                            return  <div>
                                <div>A组件Name:{context.name}</div>
                                <button onClick={context.changeName}>改变name</button>
                            </div>
                        }
                    }
                </AppContext.Consumer>
            )
        }
    }


    class App extends React.Component{
        //在顶层包裹所有元素，注入到每个子组件中

        constructor(props){
            super(props);
            this.state={
                name:'xz'
            }
        }

        shouldComponentUpdate(nextProps, nextState,nextContext) {
            console.log(nextContext,11);
            return true;
        }

        render(){
            return (
                <AppContext.Provider value={{name:this.state.name,changeName:()=>{
                        this.setState({
                            name:Math.random()
                        })
                    }}}>
                    <A/>
                </AppContext.Provider>
            )
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
</script>


</body>
```