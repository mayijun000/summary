## 在 React中使用 Svg

在 `React`中使用 `Svg`和 `vue`一样，同样存在 3种方案，一种是直接在 `react`的 `reader`方法中写入 `svg`代码，第二种则是将所有 `svg`绘制代码放到一个文件中，然后将这个文件一次性载入，使用 `use`标签引用响应的 `svg`图案，第三种则是使用插件按需引入。

第一种直接在 渲染方法中写入 `svg`的方法就不多说了，第二种也很简单 ，和 `vue`一样，只不过写法上需要注意一下。

```js
render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{position:'absolute',width:0,height:0}}>
        <defs>
          <symbol viewBox="0 0 26 31" id="location">
            <path fill="#FFF" fillRule="evenodd" d="M22.116 22.601c-2.329 2.804-7.669 7.827-7.669 7.827-.799.762-2.094.763-2.897-.008 0 0-5.26-4.97-7.643-7.796C1.524 19.8 0 16.89 0 13.194 0 5.908 5.82 0 13 0s13 5.907 13 13.195c0 3.682-1.554 6.602-3.884 9.406zM18 13a5 5 0 1 0-10 0 5 5 0 0 0 10 0z"></path>
          </symbol>
          <symbol viewBox="0 0 14 8" id="arrow">
            <path fill="#FFF" fillRule="evenodd" d="M5.588 6.588c.78.78 2.04.784 2.824 0l5.176-5.176c.78-.78.517-1.412-.582-1.412H.994C-.107 0-.372.628.412 1.412l5.176 5.176z"></path>
          </symbol>
        </svg>
      )
}
```

主要是需要注意，因为 `react`使用 `jsx`语法，不允许出现 `-` 连字符，所以像 `fill-rule`这样的属性，就必须写成 `fillRule`，引用的时候同样如此。

```js
// 引用的时候需要将 `xlink:href` 改写成 xlinkHref
<svg className="arrow-left">
   <use xlinkHref="#arrow-left"></use>
 </svg>
```

第三种按需引入，只加载当前需要的 `svg`形状，同样是将每一个 `svg`图片作为一个单独的文件保存，然后再需要使用的地方进行引用。 `Github`上有个项目 [react-svg](https://link.zhihu.com/?target=https%3A//github.com/atomic-app/react-svg)，这个项目内部其实是对 [SVGInjector](https://link.zhihu.com/?target=https%3A//github.com/iconic/SVGInjector)的包装，

安装 [react-svg](https://link.zhihu.com/?target=https%3A//github.com/atomic-app/react-svg)之后，就可以像下面这样使用了：

```js
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG
    path="atomic.svg"
    callback={svg => console.log(svg)}
    className="example"
  />,
  document.querySelector('.Root')
)
```

一般都只是在使用小图标的时候才考虑 `svg`，而这些小图标一般都比较简约，绘制起来也没什么难度，不过大部分情况下没有必要自己来画，很多网站都提供`svg`的图标下载，例如阿里的 [iconfont](https://link.zhihu.com/?target=http%3A//www.iconfont.cn/)，图标数量众多，基本可以满足绝大部分的需求，另外，类似的网站还有 [easyicon](https://link.zhihu.com/?target=http%3A//www.easyicon.net/) 、 [icomoon](https://link.zhihu.com/?target=https%3A//icomoon.io/)等。