# Vue 服务端渲染实践 ——Web应用首屏耗时最优化方案

随着各大前端框架的诞生和演变，`SPA`开始流行，单页面应用的优势在于可以不重新加载整个页面的情况下，通过`ajax`和服务器通信，实现整个`Web`应用拒不更新，带来了极致的用户体验。然而，对于需要`SEO`、追求极致的首屏性能的应用，前端渲染的`SPA`是糟糕的。好在`Vue 2.0`后是支持服务端渲染的，零零散散花费了两三周事件，通过改造现有项目，基本完成了在现有项目中实践了`Vue`服务端渲染。

关于[Vue服务端渲染](https://link.zhihu.com/?target=https%3A//ssr.vuejs.org/)的原理、搭建，官方文档已经讲的比较详细了，因此，本文不是抄袭文档，而是文档的补充。特别是对于如何与现有项目进行很好的结合，还是需要费很大功夫的。本文主要对我所在的项目中进行`Vue`服务端渲染的改造过程进行阐述，加上一些个人的理解，作为分享与学习。

## **概述**

本文主要分以下几个方面：

- 什么是服务端渲染？服务端渲染的原理是什么？

- 如何在基于`Koa`的`Web Server Frame`上配置服务端渲染？

- - 基本用法
  - `Webpack`配置



- 开发环境搭建

- - 渲染中间件配置



- 如何对现有项目进行改造？

- 基本目录改造；

- 在服务端用`vue-router`分割代码；

- - 在服务端预拉取数据；
  - 客户端托管全局状态；
  - 常见问题的解决方案；



## **什么是服务端渲染？服务端渲染的原理是什么？**

> `Vue.js`是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出`Vue`组件，进行生成`DOM`和操作`DOM`。然而，也可以将同一个组件渲染为服务器端的`HTML`字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

上面这段话是源自[Vue服务端渲染文档](https://link.zhihu.com/?target=https%3A//ssr.vuejs.org/zh/%23%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)的解释，用通俗的话来说，大概可以这么理解：

- 服务端渲染的目的是：性能优势。 在服务端生成对应的`HTML`字符串，客户端接收到对应的`HTML`字符串，能立即渲染`DOM`，最高效的首屏耗时。此外，由于服务端直接生成了对应的`HTML`字符串，对`SEO`也非常友好；
- 服务端渲染的本质是：生成应用程序的“快照”。将`Vue`及对应库运行在服务端，此时，`Web Server Frame`实际上是作为代理服务器去访问接口服务器来预拉取数据，从而将拉取到的数据作为`Vue`组件的初始状态。
- 服务端渲染的原理是：虚拟`DOM`。在`Web Server Frame`作为代理服务器去访问接口服务器来预拉取数据后，这是服务端初始化组件需要用到的数据，此后，组件的`beforeCreate`和`created`生命周期会在服务端调用，初始化对应的组件后，`Vue`启用虚拟`DOM`形成初始化的`HTML`字符串。之后，交由客户端托管。实现前后端同构应用。

## **如何在基于`Koa`的`Web Server Frame`上配置服务端渲染？**

## **基本用法**

需要用到`Vue`服务端渲染对应库`vue-server-renderer`，通过`npm`安装：

```js
npm install vue vue-server-renderer --save
```

最简单的，首先渲染一个`Vue`实例：

```js
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue');

const app = new Vue({
  template: `<div>Hello World</div>`
});

// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer();

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) {
      throw err;
  }
  console.log(html);
  // => <div data-server-rendered="true">Hello World</div>
});
```

与服务器集成：

```js
module.exports = async function(ctx) {
    ctx.status = 200;
    let html = '';
    try {
        // ...
        html = await renderer.renderToString(app, ctx);
    } catch (err) {
        ctx.logger('Vue SSR Render error', JSON.stringify(err));
        html = await ctx.getErrorPage(err); // 渲染出错的页面
    }


    ctx.body = html;
}
```

使用页面模板：

当你在渲染`Vue`应用程序时，`renderer`只从应用程序生成`HTML`标记。在这个示例中，我们必须用一个额外的`HTML`页面包裹容器，来包裹生成的`HTML`标记。

为了简化这些，你可以直接在创建`renderer`时提供一个页面模板。多数时候，我们会将页面模板放在特有的文件中：

```js
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

然后，我们可以读取和传输文件到`Vue renderer`中：

```js
const tpl = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
const renderer = vssr.createRenderer({
    template: tpl,
});
```

## **Webpack配置**

然而在实际项目中，不止上述例子那么简单，需要考虑很多方面：路由、数据预取、组件化、全局状态等，所以服务端渲染不是只用一个简单的模板，然后加上使用`vue-server-renderer`完成的，如下面的示意图所示：

![img](https://pic2.zhimg.com/80/v2-6a8834d7dbc08f849e8119d242ff2475_720w.jpg)

如示意图所示，一般的`Vue`服务端渲染项目，有两个项目入口文件，分别为`entry-client.js`和`entry-server.js`，一个仅运行在客户端，一个仅运行在服务端，经过`Webpack`打包后，会生成两个`Bundle`，服务端的`Bundle`会用于在服务端使用虚拟`DOM`生成应用程序的“快照”，客户端的`Bundle`会在浏览器执行。

因此，我们需要两个`Webpack`配置，分别命名为`webpack.client.config.js`和`webpack.server.config.js`，分别用于生成客户端`Bundle`与服务端`Bundle`，分别命名为`vue-ssr-client-manifest.json`与`vue-ssr-server-bundle.json`，关于如何配置，`Vue`官方有相关示例[vue-hackernews-2.0](https://link.zhihu.com/?target=https%3A//github.com/vuejs/vue-hackernews-2.0/)

## **开发环境搭建**

我所在的项目使用`Koa`作为`Web Server Frame`，项目使用[koa-webpack](https://link.zhihu.com/?target=https%3A//github.com/shellscape/koa-webpack)进行开发环境的构建。如果是在产品环境下，会生成`vue-ssr-client-manifest.json`与`vue-ssr-server-bundle.json`，包含对应的`Bundle`，提供客户端和服务端引用，而在开发环境下，一般情况下放在内存中。使用`memory-fs`模块进行读取。

```js
const fs = require('fs')
const path = require( 'path' );
const webpack = require( 'webpack' );
const koaWpDevMiddleware = require( 'koa-webpack' );
const MFS = require('memory-fs');
const appSSR = require('./../../app.ssr.js');

let wpConfig;
let clientConfig, serverConfig;
let wpCompiler;
let clientCompiler, serverCompiler;

let clientManifest;
let bundle;

// 生成服务端bundle的webpack配置
if ((fs.existsSync(path.resolve(cwd,'webpack.server.config.js')))) {
  serverConfig = require(path.resolve(cwd, 'webpack.server.config.js'));
  serverCompiler = webpack( serverConfig );
}

// 生成客户端clientManifest的webpack配置
if ((fs.existsSync(path.resolve(cwd,'webpack.client.config.js')))) {
  clientConfig = require(path.resolve(cwd, 'webpack.client.config.js'));
  clientCompiler = webpack(clientConfig);
}

if (serverCompiler && clientCompiler) {
  let publicPath = clientCompiler.output && clientCompiler.output.publicPath;

  const koaDevMiddleware = await koaWpDevMiddleware({
    compiler: clientCompiler,
    devMiddleware: {
      publicPath,
      serverSideRender: true
    },
  });

  app.use(koaDevMiddleware);

  // 服务端渲染生成clientManifest

  app.use(async (ctx, next) => {
    const stats = ctx.state.webpackStats.toJson();
    const assetsByChunkName = stats.assetsByChunkName;
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) {
      console.error(stats.errors);
      return;
    }
    // 生成的clientManifest放到appSSR模块，应用程序可以直接读取
    let fileSystem = koaDevMiddleware.devMiddleware.fileSystem;
    clientManifest = JSON.parse(fileSystem.readFileSync(path.resolve(cwd,'./dist/vue-ssr-client-manifest.json'), 'utf-8'));
    appSSR.clientManifest = clientManifest;
    await next();
  });

  // 服务端渲染的server bundle 存储到内存里
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err;
    }
    stats = stats.toJson();
    if (stats.errors.length) {
      console.error(stats.errors);
      return;
    }
    // 生成的bundle放到appSSR模块，应用程序可以直接读取
    bundle = JSON.parse(mfs.readFileSync(path.resolve(cwd,'./dist/vue-ssr-server-bundle.json'), 'utf-8'));
    appSSR.bundle = bundle;
  });
}
```

## **渲染中间件配置**

产品环境下，打包后的客户端和服务端的`Bundle`会存储为`vue-ssr-client-manifest.json`与`vue-ssr-server-bundle.json`，通过文件流模块`fs`读取即可，但在开发环境下，我创建了一个`appSSR`模块，在发生代码更改时，会触发`Webpack`热更新，`appSSR`对应的`bundle`也会更新，`appSSR`模块代码如下所示：

```js
let clientManifest;
let bundle;

const appSSR = {
  get bundle() {
    return bundle;
  },
  set bundle(val) {
    bundle = val;
  },
  get clientManifest() {
    return clientManifest;
  },
  set clientManifest(val) {
    clientManifest = val;
  }
};

module.exports = appSSR;
```

通过引入`appSSR`模块，在开发环境下，就可以拿到`clientManifest`和`ssrBundle`，项目的渲染中间件如下：

```js
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const vue = require('vue');
const vssr = require('vue-server-renderer');
const createBundleRenderer = vssr.createBundleRenderer;
const dirname = process.cwd();

const env = process.env.RUN_ENVIRONMENT;

let bundle;
let clientManifest;

if (env === 'development') {
  // 开发环境下，通过appSSR模块，拿到clientManifest和ssrBundle
  let appSSR = require('./../../core/app.ssr.js');
  bundle = appSSR.bundle;
  clientManifest = appSSR.clientManifest;
} else {
  bundle = JSON.parse(fs.readFileSync(path.resolve(__dirname, './dist/vue-ssr-server-bundle.json'), 'utf-8'));
  clientManifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, './dist/vue-ssr-client-manifest.json'), 'utf-8'));
}


module.exports = async function(ctx) {
  ctx.status = 200;
  let html;
  let context = await ctx.getTplContext();
  ctx.logger('进入SSR，context为： ', JSON.stringify(context));
  const tpl = fs.readFileSync(path.resolve(__dirname, './newTemplate.html'), 'utf-8');
  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: tpl, // （可选）页面模板
    clientManifest: clientManifest // （可选）客户端构建 manifest
  });
  ctx.logger('createBundleRenderer  renderer：', JSON.stringify(renderer));
  try {
    html = await renderer.renderToString({
      ...context,
      url: context.CTX.url,
    });
  } catch(err) {
    ctx.logger('SSR renderToString 失败： ', JSON.stringify(err));
    console.error(err);
  }

  ctx.body = html;
};
```

## **如何对现有项目进行改造？**

## **基本目录改造**

使用`Webpack`来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，可以使用`Webpack`支持的所有功能。

一个基本项目可能像是这样：

```js
src
├── components
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── frame
│   ├── app.js # 通用 entry(universal entry)
│   ├── entry-client.js # 仅运行于浏览器
│   ├── entry-server.js # 仅运行于服务器
│   └── index.vue # 项目入口组件
├── pages
├── routers
└── store
```

`app.js`是我们应用程序的「通用`entry`」。在纯客户端应用程序中，我们将在此文件中创建根`Vue`实例，并直接挂载到`DOM`。但是，对于服务器端渲染(`SSR`)，责任转移到纯客户端`entry`文件。`app.js`简单地使用`export`导出一个`createApp`函数：

```js
import Router from '~ut/router';
import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import { createStore } from './../store';

import Frame from './index.vue';
import myRouter from './../routers/myRouter';

function createVueInstance(routes, ctx) {
    const router = Router({
        base: '/base',
        mode: 'history',
        routes: [routes],
    });
    const store = createStore({ ctx });
    // 把路由注入到vuex中
    sync(store, router);
    const app = new Vue({
        router,
        render: function(h) {
            return h(Frame);
        },
        store,
    });
    return { app, router, store };
}

module.exports = function createApp(ctx) {
    return createVueInstance(myRouter, ctx); 
}
```

> 注：在我所在的项目中，需要动态判断是否需要注册`DicomView`，只有在客户端才初始化`DicomView`，由于`Node.js`环境没有`window`对象，对于代码运行环境的判断，可以通过`typeof window === 'undefined'`来进行判断。

## **避免创建单例**

如`Vue SSR`文档所述：

> 当编写纯客户端 (client-only) 代码时，我们习惯于每次在新的上下文中对代码进行取值。但是，Node.js 服务器是一个长期运行的进程。当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。如基本示例所示，我们为每个请求创建一个新的根 Vue 实例。这与每个用户在自己的浏览器中使用新应用程序的实例类似。如果我们在多个请求之间使用一个共享的实例，很容易导致交叉请求状态污染 (cross-request state pollution)。因此，我们不应该直接创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数，为每个请求创建新的应用程序实例。同样的规则也适用于 router、store 和 event bus 实例。你不应该直接从模块导出并将其导入到应用程序中，而是需要在 createApp 中创建一个新的实例，并从根 Vue 实例注入。

如上代码所述，`createApp`方法通过返回一个返回值创建`Vue`实例的对象的函数调用，在函数`createVueInstance`中，为每一个请求创建了`Vue`，`Vue Router`，`Vuex`实例。并暴露给`entry-client`和`entry-server`模块。

在客户端`entry-client.js`只需创建应用程序，并且将其挂载到`DOM`中：

```js
import { createApp } from './app';

// 客户端特定引导逻辑……

const { app } = createApp();

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app');
```

服务端`entry-server.js`使用`default export` 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配和数据预取逻辑:

```js
import { createApp } from './app';

export default context => {
  const { app } = createApp();
  return app;
}
```

## **在服务端用`vue-router`分割代码**

与`Vue`实例一样，也需要创建单例的`vueRouter`对象。对于每个请求，都需要创建一个新的`vueRouter`实例：

```js
function createVueInstance(routes, ctx) {
    const router = Router({
        base: '/base',
        mode: 'history',
        routes: [routes],
    });
    const store = createStore({ ctx });
    // 把路由注入到vuex中
    sync(store, router);
    const app = new Vue({
        router,
        render: function(h) {
            return h(Frame);
        },
        store,
    });
    return { app, router, store };
}
```

同时，需要在`entry-server.js`中实现服务器端路由逻辑，使用`router.getMatchedComponents`方法获取到当前路由匹配的组件，如果当前路由没有匹配到相应的组件，则`reject`到`404`页面，否则`resolve`整个`app`，用于`Vue`渲染虚拟`DOM`，并使用对应模板生成对应的`HTML`字符串。

```js
const createApp = require('./app');

module.exports = context => {
  return new Promise((resolve, reject) => {
    // ...
    // 设置服务器端 router 的位置
    router.push(context.url);
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject('匹配不到的路由，执行 reject 函数，并返回 404');
      }
      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app);
    }, reject);
  });

}
```

## **在服务端预拉取数据**

在`Vue`服务端渲染，本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析好这些数据。服务端`Web Server Frame`作为代理服务器，在服务端对接口服务发起请求，并将数据拼装到全局`Vuex`状态中。

另一个需要关注的问题是在客户端，在挂载到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。

目前较好的解决方案是，给路由匹配的一级子组件一个`asyncData`，在`asyncData`方法中，`dispatch`对应的`action`。`asyncData`是我们约定的函数名，表示渲染组件需要预先执行它获取初始数据，它返回一个`Promise`，以便我们在后端渲染的时候可以知道什么时候该操作完成。注意，由于此函数会在组件实例化之前调用，所以它无法访问`this`。需要将`store`和路由信息作为参数传递进去：

举个例子：

```js
<!-- Lung.vue -->
<template>
  <div></div>
</template>

<script>
export default {
  // ...
  async asyncData({ store, route }) {
    return Promise.all([
      store.dispatch('getA'),
      store.dispatch('myModule/getB', { root:true }),
      store.dispatch('myModule/getC', { root:true }),
      store.dispatch('myModule/getD', { root:true }),
    ]);
  },
  // ...
}
</script>
```

在`entry-server.js`中，我们可以通过路由获得与`router.getMatchedComponents()`相匹配的组件，如果组件暴露出`asyncData`，我们就调用这个方法。然后我们需要将解析完成的状态，附加到渲染上下文中。

```js
const createApp = require('./app');

module.exports = context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context);
    // 针对没有Vue router 的Vue实例，在项目中为列表页，直接resolve app
    if (!router) {
      resolve(app);
    }
    // 设置服务器端 router 的位置
      router.push(context.url.replace('/base', ''));
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject('匹配不到的路由，执行 reject 函数，并返回 404');
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute,
          });
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state;
        resolve(app);
      }).catch(reject);
    }, reject);
  });
}
```

## **客户端托管全局状态**

当服务端使用模板进行渲染时，`context.state`将作为`window.__INITIAL_STATE__`状态，自动嵌入到最终的`HTML` 中。而在客户端，在挂载到应用程序之前，`store`就应该获取到状态，最终我们的`entry-client.js`被改造为如下所示：

```js
import createApp from './app';

const { app, router, store } = createApp();

// 客户端把初始化的store替换为window.__INITIAL_STATE__
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

if (router) {
  router.onReady(() => {
    app.$mount('#app')
  });
} else {
  app.$mount('#app');
}
```

## **常见问题的解决方案**

至此，基本的代码改造也已经完成了，下面说的是一些常见问题的解决方案：

- 在服务端没有`window`、`location`对象：

对于旧项目迁移到`SSR`肯定会经历的问题，一般为在项目入口处或是`created`、`beforeCreate`生命周期使用了`DOM`操作，或是获取了`location`对象，通用的解决方案一般为判断执行环境，通过`typeof window`是否为`'undefined'`，如果遇到必须使用`location`对象的地方用于获取`url`中的相关参数，在`ctx`对象中也可以找到对应参数。

- `vue-router`报错`Uncaught TypeError: _Vue.extend is not _Vue function`，没有找到`_Vue`实例的问题：

通过查看`Vue-router`源码发现没有手动调用`Vue.use(Vue-Router);`。没有调用`Vue.use(Vue-Router);`在浏览器端没有出现问题，但在服务端就会出现问题。对应的`Vue-router`源码所示：

```js
VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );
  // ...
}
```

- 服务端无法获取`hash`路由的参数

由于`hash`路由的参数，会导致`vue-router`不起效果，对于使用了`vue-router`的前后端同构应用，必须换为`history`路由。

- 接口处获取不到`cookie`的问题：

由于客户端每次请求都会对应地把`cookie`带给接口侧，而服务端`Web Server Frame`作为代理服务器，并不会每次维持`cookie`，所以需要我们手动把
`cookie`透传给接口侧，常用的解决方案是，将`ctx`挂载到全局状态中，当发起异步请求时，手动带上`cookie`，如下代码所示：

```js
// createStore.js
// 在创建全局状态的函数`createStore`时，将`ctx`挂载到全局状态
export function createStore({ ctx }) {
    return new Vuex.Store({
        state: {
            ...state,
            ctx,
        },
        getters,
        actions,
        mutations,
        modules: {
            // ...
        },
        plugins: debug ? [createLogger()] : [],
    });
}
```

当发起异步请求时，手动带上`cookie`，项目中使用的是`Axios`：

```js
// actions.js

// ...
const actions = {
  async getUserInfo({ commit, state }) {
    let requestParams = {
      params: {
        random: tool.createRandomString(8, true),
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    // 手动带上cookie
    if (state.ctx.request.headers.cookie) {
      requestParams.headers.Cookie = state.ctx.request.headers.cookie;
    }

    // ...

    let res = await Axios.get(`${requestUrlOrigin}${url.GET_A}`, requestParams);
    commit(globalTypes.SET_A, {
      res: res.data,
    });
  }
};

// ...
```

- 接口请求时报`connect ECONNREFUSED 127.0.0.1:80`的问题

原因是改造之前，使用客户端渲染时，使用了`devServer.proxy`代理配置来解决跨域问题，而服务端作为代理服务器对接口发起异步请求时，不会读取对应的`webpack`配置，对于服务端而言会对应请求当前域下的对应`path`下的接口。

解决方案为去除`webpack`的`devServer.proxy`配置，对于接口请求带上对应的`origin`即可：

```js
const requestUrlOrigin = requestUrlOrigin = state.ctx.URL.origin;
const res = await Axios.get(`${requestUrlOrigin}${url.GET_A}`, requestParams);
```

- 对于`vue-router`配置项有`base`参数时，初始化时匹配不到对应路由的问题

在官方示例中的`entry-server.js`：

```js
// entry-server.js
import { createApp } from './app';

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // ...
  });
}
```

原因是设置服务器端`router`的位置时，`context.url`为访问页面的`url`，并带上了`base`，在`router.push`时应该去除`base`，如下所示：

```js
router.push(context.url.replace('/base', ''));
```

## **小结**

本文为笔者通过对现有项目进行改造，给现有项目加上`Vue`服务端渲染的实践过程的总结。

首先阐述了什么是`Vue`服务端渲染，其目的、本质及原理，通过在服务端使用`Vue`的虚拟`DOM`，形成初始化的`HTML`字符串，即应用程序的“快照”。带来极大的性能优势，包括`SEO`优势和首屏渲染的极速体验。之后阐述了`Vue`服务端渲染的基本用法，即两个入口、两个`webpack`配置，分别作用于客户端和服务端，分别生成`vue-ssr-client-manifest.json`与`vue-ssr-server-bundle.json`作为打包结果。最后通过对现有项目的改造过程，包括对路由进行改造、数据预获取和状态初始化，并解释了在`Vue`服务端渲染项目改造过程中的常见问题，帮助我们进行现有项目往`Vue`服务端渲染的迁移。