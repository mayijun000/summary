# 如何优雅的只在当前页面中覆盖ui库中组件的样式

下面说下优雅的解决方式：通过深度选择器解决。例如修改上图中组件里的van-ellipsis类的样式，可以这样做：

```css
.van-tabs /deep/ .van-ellipsis { color:blue};
```

编译后的结果就是：

```css
.van-tabs[v-data-23d425f8] .van-ellipsis {
	color:blue
}
```

这样就不会给van-ellipsis也添加[data-v-23d425f8]属性了。至此你可以愉快的修改第三方组件的样式了。当然了这里的深度选择器/deep/是因为我用的less语言，如果你没有使用less/sass等，可以用>>>符号。