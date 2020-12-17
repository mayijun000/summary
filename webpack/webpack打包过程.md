# webpack打包过程

webpack的打包流程是采用事件流的模式，其内部使用Tapable进行事件定义。

Tapable是一个类似于nodejs的EentEmitter的库，主要控制钩子函数的事件发布和事件订阅。而webpack内部定义着大量功能丰富的插件，我们在前面提到过插件的功能贯穿了整个webpack打包流程，这些插件都会注册在Tapable定义的事件上，在打包过程中会依次有序的触发这些事件以调用插件执行其功能。

webpack内部定义了两个核心对象：compiler和compilation。这两个对象都集成自Tapable类，以便在其内部定义事件调用插件

**Compiler：**Compiler是webpack编译打包的核心对象，webpack编译每次编译开始时会创建一个全局唯一的compiler对象，compiler对象再创建一个compilation对象来负责模块的打包流程。

**Compilation：**compilation对象是Compiler编译过程中由compiler对象创建的，其内部也定义了大量的事件钩子以便插件调用。compilation负责打包的整个流程：加载(loaded)，封存(sealed),优化(optimization)，分块(chunked)和重新创建(restored)。当采用非watch模式启动编译时，只会创建一次compilation对象，当使用watch模式时（通常使用webpack-dev-server调用底层代码进行监听），每次模块内容变动时都会创建一个新的compilation对象。

上面我们了解了webpack的核心对象，现在让我们来分析webpack的源码。通常阅读源码时我们需要从主模块来开始阅读，其主模块为/node_modules/webpack/lib/webpack.js文件。主模块的webpack方法内首先会检查我们的配置文件格式是否有误。当配置文件格式准确无误时，接下来便开始创建compiler对象

```js
    compiler = new Compiler(options.context);
```

在webpack方法的底部会判断是否由监听模式启动（通常我们会使用webpack-dev-server来启动监听模式），如果为监听模式，便会调用compiler对象的watch方法，反之便会调用run方法。

```js
    if (
      options.watch === true ||
      (Array.isArray(options) && options.some(o => o.watch))
    ) {
      const watchOptions = Array.isArray(options)
        ? options.map(o => o.watchOptions || {})
        : options.watchOptions || {};
      return compiler.watch(watchOptions, callback);
    }
    compiler.run(callback);
```

我们先不要急着离开这里。文件的下面导出了大量webpack内置的插件，这些插件内部会监听不同的事件。即上面所说的，webpack编译过程中会触发不同的事件，那是便是这些插件大显神通的时候了。

```js
#compiler.js
exportPlugins(exports, {
  AutomaticPrefetchPlugin: () => require("./AutomaticPrefetchPlugin"),
  BannerPlugin: () => require("./BannerPlugin"),
    ...
```

接下来让我们走进webpack的编译过程。

调用compiler实例的run方法时，会依次触发beforeRun和run两个钩子

beforeRun

compiler.run() 执行之前，添加一个钩子

run

正是启动一次新的编译

```js
#compiler.js method：run()  
this.hooks.beforeRun.callAsync(this, err => {
      if (err) return finalCallback(err);
      this.hooks.run.callAsync(this, err => {
        if (err) return finalCallback(err);
        this.readRecords(err => {
          if (err) return finalCallback(err);
          this.compile(onCompiled);
        });
      });
    });
```

在compiler.run方法内部会触发compiler的compile方法，compiler.compile方法内部会创建一个compilation对象

```js
#compiler.js method：compile()
const compilation = this.newCompilation(params);
```

创建完compilation对象过程中，会触发thisCompilation和compilation钩子。

thisCompilation

触发 compilation 事件之前执行。

compilation

表示一个compilation对象创建完成

```js
 #compiler.js method: newCompilation()  
 this.hooks.thisCompilation.call(compilation, params);
 this.hooks.compilation.call(compilation, params);
```

在compilation钩子执行过程中，会调用不同的loader来完成对文件的编译工作。同时也会触发一些文件转换的钩子事件。

buildModule

在模块构建开始之前触发

normalModuleLoader

普通模块loader钩子，会一个接一个的加载模块图中的所有模块，并使用acorn将文件转换成AST以供webpack进行分析

seal

所有的模块都通过loader转换完成时，开始生成chunk

创建完compilation对象，回到compiler的compile方法内部，触发make钩子。

make

开启模块编译过程，从entry入口开始不断递归依赖

```js
#compiler.js method：compile()
this.hooks.make.callAsync(compilation, err => {
```

编译过程结束，接下来调用compilation对象的finish方法，在finish方法内部会触发compilation对象的finishModule钩子，代表所有模块全部完成构建。

finishModule

所有模块全部完成构建

后面会调用compilation的seal方法，seal方法内部完成的功能比较多，会依次完成模块的优化，哈希化等工作。这里涉及了很多打包过程的细节，由于我们今天只探讨webpack的打包流程，便不对这些细节一一列举。

当所有的模块打包工作做好之后，便会触发compiler对象的afterCompile钩子，代表此次编译已经完成。

```js
#compiler.js method: compile()
this.hooks.afterCompile.callAsync(compilation, err => {
```

上述过程全部结束之后会根据开发者的配置文件出口配置将输出文件打包到相应的输出目录。

Webpack是一个及其庞大的项目，源码相对来说也非常复杂，这里只列出关键流程，帮助大家能够对webpack打包过程有一个比较清晰的认识。

### 简单描述流程如下：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的     entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。