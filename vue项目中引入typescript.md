### vue项目中引入typescript



1. **什么是typescript**

​        <font color=red>TypeScript</font> 是 `JavaScript` 的强类型版本。然后在编译期去掉类型和特有语法，生成纯粹的 `JavaScript` 代码。由于最终在浏览器中运行的仍然是 `JavaScript`，所以<font color=red>TypeScript</font>并不依赖于浏览器的支持，也并不会带来兼容性问题。

​        <font color=red>TypeScript</font>是 `JavaScript` 的超集，这意味着他支持所有的 `JavaScript` 语法。并在此之上对 `JavaScript` 添加了一些扩展，如 `class` / `interface` / `module` 等。这样会大大提升代码的可阅读性。

​		与此同时，<font color=red>TypeScript</font>也是 `JavaScript ES6` 的超集，`在vue3.0中也将采用 `<font color=red>TypeScript</font>进行开发。这更是充分说明了这是一门面向未来并且脚踏实地的语言。

2. **为什么要接入typescript**

   javascript由于自身的弱类型，使用起来非常灵活。这也就为大型项目、多人协作开发埋下了很多隐患。如果是自己的私有业务倒无所谓，主要是对外接口和公共方法，对接起来非常头疼。主要表现在几方面：

- 参数类型没有校验，怎么传都有，有时会出现一些由于类型转换带来的未知问题。
- 接口文档不规范，每次都要通过读代码才能知道传什么，怎么传
- 接口编写符合规范，但是公共库中有大量的处理类型校验的代码

  这就非常不利于工程标准化。于是我们决定引入typescript进行代码层面的强校验。

3. **原有vue项目接入ts主要包含下面几大步骤**：

   1) 安装typescript相关npm包

   2) 修改webpack和ts配置文件

   3) 项目公共库和vue文件改造

   

具体可以看下面的参考链接

相关参考:	[vue-typescript入门](https://www.jianshu.com/p/8ba2cdbfabd7)

​					[github参考项目](https://github.com/biaochenxuying/blog-vue-typescript)

​					[原有vue项目接入typescript](https://www.cnblogs.com/fundebug/p/10042983.html)

​					[Vue全家桶+TypeScript使用总结](https://www.jianshu.com/p/6c064270691f)

​					[typescript教程](https://ts.xcatliu.com/)

