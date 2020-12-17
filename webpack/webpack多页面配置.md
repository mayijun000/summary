# webpack多页面配置

## 一、引子

Webpack 的entry支持多种类型，包括字符串、对象、数组。从作用上来说，包括了**单文件入口**和**多文件入口**两种方式。
单文件的用法如下：

```js
module.exports = {
    entry: 'path/to/my/entry/file.js'
};
// 或者使用对象方式
module.exports = {
    entry: {
        main: 'path/to/my/entry/file.js'
    }
};
```

单文件入口可以快速创建一个只有单一文件入口的情况，例如 library 的封装，但是单文件入口的方式相对来说比较简单，在扩展配置的时候灵活性较低。

多文件入口是使用对象语法来通过支持多个entry，多文件入口的对象语法相对于单文件入口，具有较高的灵活性，例如多页应用、页面模块分离优化。多文件入口的语法如下：

```js
module.exports = {
    entry: {
        home: 'path/to/my/entry/home.js',
        search: 'path/to/my/entry/search.js',
        list: 'path/to/my/entry/list.js'
    }
};
```

上面的语法将entry分成了 3 个独立的入口文件，这样会打包出来三个对应的 bundle。对于一个 HTML 页面，推荐只有一个 entry ，通过统一的入口，解析出来的依赖关系更方便管理和维护。

一个 webpack 的配置，可以包含多个entry**，**但是只能有一个output。对于不同的entry可以通过output.filename占位符语法来区分，比如：

```js
module.exports = {
    entry: {
        home: 'path/to/my/entry/home.js',
        search: 'path/to/my/entry/search.js',
        list: 'path/to/my/entry/list.js'
    },
    output: {
        filename: '[name].js', // 这个是 bundle 的名称
        path: __dirname + '/dist' // 此选项制定了输出的 bundle 存放的路径，比如dist、output等
    }
};
```

## 二、多页应用

多页应用，顾名思义最后我们打包生成的页面也是多个，即 HTML 是多个；多页应用不仅仅是页面多个，入口文件也是多个；多页应用可能页面之间页面结构是不同的，比如一个网站项目，典型的三个页面是：首页、列表页和详情页，肯定每个页面都不一样。

**多页面问题**

多页面就是指的多个 HTML 页面，这时候可以直接借助 html-webpack-plugin 插件来实现，我们只需要多次实例化一个 html-webpack-plugin 的实例即可。

下面是同一个 template，那么可以只修改 filename 输出不同名的 HTML 即可：

```js
const HtmlWebPackPlugin = require('html-webpack-plugin');

const indexPage = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: 'index.html'
});
const listPage = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: 'list.html'
});
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    plugins: [indexPage, listPage]
};
```

对于页面结构不同的 HTML 页面的配置，使用不同的 template 即可。

```js
const HtmlWebPackPlugin = require('html-webpack-plugin');

const indexPage = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: 'index.html'
});
const listPage = new HtmlWebPackPlugin({
    template: './src/list.html',
    filename: 'list.html'
});
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    plugins: [indexPage, listPage]
};
```

上面的多页面解决是多次实例化 html-webpack-plugin，根据传入的参数不同（主要是 filename 不同），打包出两个文件，但是这两个文件的特点是引入的 JavaScript 文件都是一样的，即都是main.js 。

如果我们的项目是一个由多个路由或页面组成的，但是代码中只有一个单独的 JavaScript 文件（一个单独的入口 chunk），这样会导致不管访问任何页面都会加载整站资源，让用户付出额外的流量。此外，如果这个用户经常只是访问其中的某个页面，但是当我们更改了其它页面的代码，Webpack 将会重新编译，那么整个 bundle 的文件名哈希值就会发生变化，最终导致用户重新下载整个网站的代码，造成不必要的浪费。
这时候合理的做法是将整个项目利用多页面打包方案进行划分，将代码按照页面进行拆分，这样用户访问某个页面的时候，实际下载的只是当前页面的代码，而不是整个网站的代码，浏览器也更好的缓存了这部分代码，当其他页面代码发生变化的时候，当前代码的哈希值不会失效，自然用户不会重复下载相同的代码了。

对于多入口，并且入口需要区分的情况，那么需要怎么处理呢？

**多入口问题**

需要借助 html-webpack-plugin 的两个参数了：chunks和excludeChunks。chunks 是当前页面包含的 chunk 有哪些，可以直接用 entry 的key 来命名，excludeChunks则是排除某些 chunks。
例如，现在有两个 entry，分别是index.js 和list.js，我们希望index.html跟index.js是一组，list.html跟list.js 是一组，那么 webpack.config.js 需要修改为：

```js
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        list: './src/list.js'
    },
    plugins: [
        new HtmlWebPackPlugin({
           template: './src/index.html', 
           filename: 'index.html', 
           chunks: ['index']
        }),
        new HtmlWebPackPlugin({
           template: './src/list.html',
           filename: 'list.html', 
           chunks: ['list']})
    ]
};
```

## 三、代码实践

3.1.1 建一个如下目录结构的工程，保证 template 和实际的 entry 是固定的目录，并且名字都是对应的。代码见[github](https://link.zhihu.com/?target=https%3A//github.com/SageSanyue/webpackDemo/tree/master/multiPageApp)

```text
├── package.json
├── src
│   └── entry
│       ├── detail.js
│       ├── index.js
│       └── list.js
├── template
│   ├── detail.html
│   ├── index.html
│   └── list.html
└── webpack.simple.js
```

3.1.2 npm init初始化package.json，scripts中加入对应此webpack配置文件的相应指令:

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
 +   "build:simple": "webpack --config webpack.simple.js"
  },
```


3.1.3 npm install下载各种依赖

```text
npm install webpack webpack-cli --save-dev
npm install html-webpack-plugin --save-dev
npm install @babel/core @babel/cli @babel/preset-env babel-loader --save-dev
```

3.1.4 配置webpack文件

```js
// webpack.simple.js手动写法
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        'index': './src/entry/index.js',
        'list': './src/entry/list.js',
        'detail': './src/entry/detail.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './template/list.html',
            filename: 'list.html',
            chunks: ['list']
        }),
        new HtmlWebpackPlugin({
            template: './template/detail.html',
            filename: 'detail.html',
            chunks: ['detail']
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }]
    }
}
```

3.1.5 执行 npm run build:simple命令，可以看到执行打包后得到的dist目录里对应的html文件引入了打好的对应js文件。

![img](https://pic4.zhimg.com/80/v2-fbf3a5f2bca3f4057134ed0bb1fa7deb_720w.jpg)

3.2 方法2:非手动匹配方法——借用globby模块指定
3.2.1 使用了 [globby](https://link.zhihu.com/?target=https%3A//www.npmjs.com/package/globby) 这个 NPM 模块

```js
npm install globby --save-dev
```

3.2.2 删掉上种手动配置得到的dist文件夹，在项目中新建utils.js文件:

```js
const path = require('path');
const globby = require('globby');

const getEntry = (exports.getEntry = () => {
    // 异步方式获取所有的路径
    const paths = globby.sync('entry/*.js', {
        cwd: path.join(__dirname, './src')
    });
    const rs = {};
    paths.forEach(v => {
        // 计算 filename
        const name = path.basename(v, '.js');
        let p = path.join('./src', v);
        if (!p.startsWith('.')) { // 转成相对地址
            p = './' + p;
        }

        rs[name] = p;
    });
    return rs;
});

// 输出内容
console.log(getEntry());

const HtmlWebPackPlugin = require('html-webpack-plugin');

exports.getHtmlWebpackPlugins = () => {
    const entries = getEntry();
    return Object.keys(entries).reduce((plugins, filename) => {
        plugins.push(
            new HtmlWebPackPlugin({
                template: `./template/${filename}.html`,
                filename: `${filename}.html`,
                chunks: [filename]
            })
        );
        return plugins;
    }, []);
};
```

3.2.3 新建webpack.auto.js文件并配置:

```js
const {getEntry, getHtmlWebpackPlugins} = require('./utils');
const path = require('path')

module.exports = {
    mode: 'development',
    entry: getEntry(),
    plugins: [
        //...
        ...getHtmlWebpackPlugins()
    ],
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }]
    }
};
```

3.2.4 package.json中加入对应此webpack配置文件的相应指令：

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:simple": "webpack --config webpack.simple.js",
 +   "build:globby": "webpack --config webpack.auto.js"
  },
```

3.2.5 执行npm run build:globby命令，得到dist打包文件夹，可以看到globby遍历路径的方式与前一种人工配对的方式一样可以成功打包多页面应用。

![img](https://pic4.zhimg.com/80/v2-328fd238cfa128e6ed24d9bf247d9ca7_720w.jpg)