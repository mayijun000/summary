# 优化webpack构建时间的小技巧

有几个小技巧可以是构建时间从一分半骤降至20秒，rebuild骤降到1秒左右。

### smp

在此之前，我们需要有一个量化的指标证明我们做的是有意义的。这时候 [speed-measure-webpack-plugin](https://link.zhihu.com/?target=https%3A//www.npmjs.com/package/speed-measure-webpack-plugin)就派上用场。它可以测量各个插件和loader的使用时间，量化指标。

根据官网的教程，用smp包裹webpack配置后，执行构建，会得到如下的信息：



![img](https://pic1.zhimg.com/80/v2-2c0a70b8644937ab4cfebd710a2f0158_720w.jpg)



我们可以从中得到优化后的时间和具体每个插件和loaders所花时间。

### cache-loader

添加完SMP后，我们要处理的第一个问题就是初始化构建的时间(这里指的是首次构建之后w，ebpack再次构建所花费的时间)，这里引入我们所需的第一个loader：[cache-loader](https://link.zhihu.com/?target=https%3A//github.com/webpack-contrib/cache-loader)

`cache-loader`是一个将之前的结果缓存到硬盘(数据库)的loader，意味着下一次执行webpack的时候，会有很显著显著的提升。

demo如下：

```js
{
  rules: [
    {
      test: /\.jsx?$/,
      use: [
        'cache-loader',
        'babel-loader',
      ],
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'cache-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader',
      ],
    },
  ]
}
```

增加后，我们能过省去大约75秒的首次构建时间。接下来，让我们处理rebuild时间，更新devtool就能达到比较明显的效果。

### webpack source maps

在webpack的配置中，我们可以找到一个devtool的配置，根据[文档](https://link.zhihu.com/?target=https%3A//webpack.js.org/configuration/devtool/)所示，它可以让我们：

> 选择一种风格的source map去增强debugger能力。不过这个功能会影响build和rebuild的速度。

换句话说，改变这个配置，你会得到对应的source maps结果，并且更重要的是，它会影响你得到bundle的等待时间。

根据使用经验来合理配置devtool，我们可以改变devtool的值从最慢的source-map -> eval-sourcemap，这个操作让我们把时间从14秒减少到3.5秒。

```js
{
  devtool: process.env.NODE_ENV === 'development'
    ? 'eval-source-map'
    : 'source-map'
}
```

文档上还有很多值。你可以选择最适合你的哪一种。

### transpile

另外，现在浏览器已经支持了大部分的最新语法和api，在开发环境中，我们并不需要那种完美的打包方案，比如下面这样：

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: [
          'last 1 chrome version',
          'last 1 safari version',
          'last 1 firefox version',
        ].join(', '),
      },
    ],
  ],
  // ...
}
```

上面三个简单的技巧，可以显著的减少构件时间，提升开发体验。