# 关于vue rem适配布局方案

## PostCSS的插件

> 作用：用于自动将像素单元生成rem单位
> **记以下三种**

- [postcss-plugin-px2rem](https://www.npmjs.com/package/postcss-plugin-px2rem)
- [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem)
- [postcss-px2rem](https://www.npmjs.com/package/postcss-px2rem)

> 任选一种，最近大家推荐第一种（在配置上多了配置选项上有 `exclude` 属性，可配置是否对 某个文件夹下的所有css文件不进行转换），之前我用的第二种（也是目前使用最多的）
> 都有可以配置`selectorBlackList: []` 要忽略并保留为px的选择器
> 还有个小技巧 -- 如果个别地方不想转化px。可以简单的使用大写的 `PX` 或 `Px` 。

#### 使用方法

1. 选择你要用的插件安装依赖： `npm i postcss-plugin-px2rem -D`或 `npm i postcss-pxtorem -D` 或 `npm i postcss-px2rem -D`
2. 配置方法

> 换算单位 **pc端一般基数为37.5，移动端一般为16或者32**

- 用`vue init webpack projectName` 创建的项目，postcss配置文件在根目录下 `.postcssrc.js`
  （该文件为使用vue init自动创建的文件）

```js
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "autoprefixer": {},
    // 新增
    /**
     * postcss-plugin-px2rem 配置
     * 详见官方文档
    */
    'postcss-plugin-px2rem': {
        // rootValue: 100, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。 
        // unitPrecision: 5, //允许REM单位增长到的十进制数字。
        //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
        // propBlackList: [], //黑名单
        exclude: /(node_module)/,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
        // selectorBlackList: [], //要忽略并保留为px的选择器
        // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
        // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
        mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
        minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
    }

    /**
     * postcss-pxtorem 配置
     * 详见官方文档
    */
    'postcss-pxtorem': {
      rootValue: 37.5,    // 换算的基数 默认100，作用 设计稿上元素宽375px,最终页面会换算成 10rem
      selectorBlackList  : ['weui','mu'], // 忽略转换正则匹配项（选择器）
      propList: ['*']
    }

    /**
     * postcss-px2rem配置
     * 详见官方文档
    */
    'postcss-px2rem': {
      remUnit: 30   // 换算的基数
    }

  }
}
```

- 用vue-cli3.0中 `vue create projectName` 创建的项目， 没有了build和config文件夹，postcss配置文件在根目录下 `postcss.config.js` (该文件为使用vue-cli3自动创建的文件)

```js
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },

    /**
     * postcss-plugin-px2rem 配置
     * 详见官方文档
    */
    'postcss-plugin-px2rem': {
        // rootValue: 32, 
        // unitPrecision: 5, 
        // propWhiteList: [],  
        // propBlackList: [], 
        exclude: /(node_module)/,  
        // selectorBlackList: [], 
        // ignoreIdentifier: false, 
        // replace: true, 
        mediaQuery: false,  
        minPixelValue: 3 
    }

    /**
     * postcss-pxtorem 配置
     * 详见官方文档
    */
    'postcss-pxtorem': {
      rootValue: 37.5,  
      selectorBlackList  : ['weui','mu'], 
      propList: ['*']
    }

    /**
     * postcss-px2rem配置
     * 详见官方文档
    */
    'postcss-px2rem': {
      remUnit: 30   // 换算的基数
    }


  }
}
```

> 个人习惯，有人喜欢所有的配置都放到了vue.config.js（vue-cli3.0默认没有此文件，需要你创建一个）中
> （一般会在里面配置有代理跨域）

```js
module.exports = {
  //反向代理的配置
  devServer: {
    proxy: {
      '/api': {
          target: 'http://m.maoyan.com', //目标地址
          // ws: true, //// 是否启用websockets
          changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
          pathRewrite: {'^/api': '/'}    //这里重写路径
      }
    }
  },
}
```

- postcss配置如下

```js
module.exports = {
  /**
   * 反向代理的配置 
  */
  lintOnSave: true,
   css: {
        loaderOptions: {
            postcss: {
                plugins: [
                  /**
                   * postcss-plugin-px2rem 配置
                   * 详见官方文档
                  */
                  require('postcss-plugin-px2rem')({
                        // rootValue: 100, 
                        // unitPrecision: 5, 
                        //propWhiteList: [],  
                        // propBlackList: [], 
                        exclude: /(node_module)/,  
                        // selectorBlackList: [], 
                        // ignoreIdentifier: false,  
                        // replace: true,
                        mediaQuery: false, 
                        minPixelValue: 3 
                    }),
                 /**
                   * postcss-pxtorem 配置
                   * 详见官方文档
                  */
                  require('postcss-pxtorem')({
                        rootValue : 1, 
                        selectorBlackList  : ['weui','mu'], 
                        propList   : ['*'],
                    }),
                 /**
                   * postcss-pxtorem 配置
                   * 详见官方文档
                  */
                  require('postcss-px2rem')({ 
                        remUnit: 30
                  }), // 换算的基数
                ]
            }
        }
   }
}
```

### 也可以通过自己写js的方式实现

src目录下，新建 utils/rem.js 输入如下代码

web适配方案

> 以下为pc版本 **pc设计稿调整为1080** 若为移动版，**移动端web 设计稿调整为750**

```js
// 基准大小 
const baseSize = 32
// 设置 rem 函数 
function setRem() {
  // 当前页面宽度相对于 1080 宽的缩放比例，可根据自己需要修改。 
  const scale = document.documentElement.clientWidth / 1080
  // 设置页面根节点字体大小 
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
}
// 初始化 
setRem()
// 改变窗口大小时重新设置 rem 
window.onresize = function () { setRem() }
```

或

```js
// 设置 rem 函数
function setRem () {

    // 320 默认大小16px; 320px = 20rem ;每个元素px基础上/16
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //得到html的Dom元素
    let htmlDom = document.getElementsByTagName('html')[0];
    //设置根元素字体大小
    htmlDom.style.fontSize= htmlWidth/20 + 'px';
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
    setRem()
}
```

- 最后在main.js中引入rem.js `import './libs/rem.js';`