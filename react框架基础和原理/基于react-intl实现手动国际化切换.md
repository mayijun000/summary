# 基于react-intl实现手动国际化切换

## 前言

国际化是一个很常见的需求，之前没有这方面的相关经验，所以决定练一下手。正好最近在写一个react骨架（新项目可直接移植的骨架），上网查了一下，常用的解决方案是yahoo的`react-intl`库，大致效果如下。

<iframe frameborder="0" allowfullscreen="" src="https://www.zhihu.com/video/1001427383429136384?autoplay=false&amp;useMSE=" style="display: block; width: 688px; height: 387px;"></iframe>

## 实现思路

- 首先解决静态国际化，即根据浏览器的语言，自动加载对应的语言模板。这里只需判断`navigator.language`类型即可，然后通过react-intl提供了`IntlProvider`组件，加载组件属性的locale和messages，最后在需要用到国际化的组件里，引入`FormattedMessage`组件（react-intl内置），通过id映射到对应的国际化文件里的属性（例如下面的en_US.js的hello）。即可实现静态国际化。
- 动态国际化，即用户可以通过按钮切换，实现语言的切换。最容易想到的方案就是，在语言模板放在redux的store里，提供一个切换语言的action，改变store里的国家和语言模板，再触发对应的`FormattedMessage`组件渲染。let's do it！

## 代码实现

- 在src下新建locale文件存放国际化语言的文件，这里我们新建了en_US.js和zh_CN.js。

**en_US.js**

```js
const en_US = {
  hello: 'Hello, world!',
  name: 'my name is {name}'
}    
export default en_US;
```

**zh_CN.js**

```js
const zh_CN = {
  hello: '你好，世界！',
  name: '我的名字是 {name}'
}
export default zh_CN;
```

一个是常规的变量`hello`，一个是带有变量`{name}`的字段`name`。



- react-intl的`IntlProvider`组件类似redux的`Provider`组件，需要在全局引入。所以我们封装一下`Intl.jsx`组件，将redux和`IntlProvider`相结合。

**Intl.jsx**

```js
import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import zh_CN from './locale/lang/zh_CN';
import en_US from './locale/lang/en_US.js';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

addLocaleData([...zh,...en]);

class Inter extends Component {
  render() {
    let { locale, localeMessage, children } = this.props;
    return (
      <IntlProvider key={locale} locale={locale} messages={localeMessage}>
        {children}
      </IntlProvider>
    )
  }
};

function chooseLocale(val) {
  let _val = val || navigator.language.split('_')[0];
  switch (_val) {
    case 'en':
      return en_US;
    case 'zh':
      return zh_CN;
    default:
      return en_US;
  }
}

const mapStateToProps = (state, ownProps) => ({
  locale: state.root.language,
  localeMessage: chooseLocale(state.root.language)
});

let Intl = connect(mapStateToProps)(Inter);

export default Intl;
```

解释一下这个组件，组件是将redux里的数据绑定到`IntlProvider`组件上，`addLocaleData`函数添加需要本地化的语言，这个需要声明。redux中传递两个props，`locale`代表当前语言，`localeMessage`代表locale里的语言文件内容。

**这里有一个很关键的地方，即key属性。IntlProvider中的属性变更并不会触发`FormattedMessage`重新渲染，刚开始想要forceUpdate强制更新组件，后来上网查了一个解决方案，在组件中加入key，就能解决这个问题。**

[React-Intl how to switch locale and messages from variablestackoverflow.com![图标](https://pic1.zhimg.com/v2-2d47e939feed796bcf7483d306661c88_ipico.jpg)](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/44635584/react-intl-how-to-switch-locale-and-messages-from-variable/51219414%2351219414)



- 在实际使用语言的组件中引入`FormattedMessage`，当然react-intl还支持其他类型的转换组件，比如时间类型`FormattedDate`等等。可从官网上查询API。[react-intl github](https://link.zhihu.com/?target=https%3A//github.com/yahoo/react-intl/)

**App.js**

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormattedMessage } from 'react-intl';
import actions from '../actions/index.js';
import { connect } from 'react-redux';

class App extends Component {
  changeLanguage() {
    let lang = this.props.locale;
    lang = lang === 'zh' ? 'en' : 'zh';
    this.props.changeLanguage(lang);
  }
  render() {
    const { locale } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            <FormattedMessage
              id="hello"
            />
          </h1>
        </header>
        <p className="App-intro">
          <FormattedMessage
            id="name"
            values={{ name: <b>{'carroll'}</b> }}
          />
        </p>
        <button onClick={() => this.changeLanguage()}>{locale === 'zh' ? '切换英文' : 'change chinese'}</button>

      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  locale: state.root.language,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  changeLanguage: (val) => dispatch(actions.changeLanguage(val))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
```

App.js主要实现了两个功能，一个实现动态切换的action，一个`FormattedMessage`id与数据的绑定。



- 最后在根文件引入`Intl.jsx`即可

```js
// ... 省略前面的引入
ReactDOM.render(
  <Provider store={store}>
    <Intl>
      <App />
    </Intl>
  </Provider>,
  document.getElementById('root'));
```

## 总结

整体实现下来，动态的国际化切换也没有多难，但是我们要有思考。把国际化的数据放在redux中是否有些浪费，可否不引入`FormattedMessage`也能解决文字的切换，在`IntlProvider`上绑定key是否会造成其他无关组件的重新渲染。这些都是我们需要考虑的问题。