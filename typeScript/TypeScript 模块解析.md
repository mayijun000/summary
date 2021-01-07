# TypeScript 模块解析

## 一、简述

Typescript 的工作一共有两项：

1. 类型检查
2. 代码转换

为了能做出正确的类型检查，Typescript 编译器首先需要通过`预编译器`计算出参与编译的文件。在计算导入（import）模块时 Typescript 使用`模块解析`

## 1.1、概念

Typescript `模块解析`就是指导 ts `编译器`查找导入（import）内容的`流程`

## 1.2、解析策略

模块解析供有两种策略：`Classic` 和 `Node`

## 1.3、模块导入方式分类

1. 相对导入
2. 非相对导入

`相对导入`是以`/`，`./`或`../`开头的

```ts
import Entry from "./components/Entry"
```

其它形式的导入被当作`非相对`的

```text
import * as $ from "jQuery"
```

## 1.4、文件选择优先级

当解析 import 导入的的时候，会优先选择 .ts 文件而不是 .d.ts 文件，以确保处理的是最新的文件

> 注意：其实 Typescript 查找扩展名依次是`.ts`，`.tsx`和`.d.ts`，为了减少描述复杂度，后面都省略对 .tsx 的查找

## 二、Classic 解析策略

## 2.1、相对导入

相对导入的模块是相对于导入它的文件进行解析

![img](https://pic2.zhimg.com/80/v2-ce261e60620c310f0694be255f274b79_720w.jpg)classic 相对模块导入

例如：

```text
//路径： /root/src/folder/A.ts
import { b } from "./moduleB"
```

查找流程如下：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

## 2.2、非相对导入

非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件

![img](https://pic2.zhimg.com/80/v2-c24e6454329e9940dcda1dca55748b49_720w.jpg)classic 非相对模块导入

例如：

```text
//路径： /root/src/folder/A.ts
import { b } from "moduleB"
```

查找流程如下：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

## 三、node 解析策略

这个解析策略试图在运行时模仿[Node.js](https://link.zhihu.com/?target=https%3A//nodejs.org/)模块解析机制。 完整的Node.js解析算法可以在[Node.js module documentation](https://link.zhihu.com/?target=https%3A//nodejs.org/api/modules.html%23modules_all_together)找到

## 3.1、相对模块解析

![img](https://pic3.zhimg.com/80/v2-f9d6d1c9fa8d26847f2307d7b70d2fa6_720w.jpg)node 相对模块解析

例如：

```ts
// 文件/root/src/moduleA.ts
import { b } from "./moduleB"
```

查找流程如下：

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.d.ts`
3. `/root/src/moduleB/package.json` (如果指定了`"types"`属性)
4. `/root/src/moduleB/index.ts`
5. `/root/src/moduleB/index.d.ts`

## 3.2、非相对模块导入

![img](https://pic2.zhimg.com/80/v2-9fe0cb448ffaf4f5c0e310750652ba61_720w.jpg)node 非相对模块导入

例如：

```text
// 文件/root/src/moduleA.ts
import { b } from "moduleB"
```

查找流程如下：

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.d.ts`
3. `/root/src/node_modules/moduleB/package.json` (如果指定了`"types"`属性)
4. `/root/src/node_modules/moduleB/index.ts`
5. `/root/src/node_modules/moduleB/index.d.ts`
6. `/root/src/node_modules/@types/moduleB`

...继续往上找

> 注意：
> 当我们添加配置选项 *typeRoots* 配置只表示默认包含的包，并不表示增加了查找文件夹

## 四、模块解析相关配置项

## 4.1、moduleResolution

指定使用哪种模块解析策略

> 若未指定，那么在使用了`--module AMD | System | ES2015`时的默认值为[Classic](https://link.zhihu.com/?target=https%3A//www.tslang.cn/docs/handbook/module-resolution.html%23classic)，其它情况时则为[Node](https://link.zhihu.com/?target=https%3A//www.tslang.cn/docs/handbook/module-resolution.html%23node)

## 4.2、baseUrl

设置`baseUrl`来告诉编译器到哪里去查找模块。 所有非相对模块导入都会被当做相对于`baseUrl`。

## 4.3、paths

`TypeScript`编译器通过使用`tsconfig.json`文件里的"`paths`"来支持这样的`声明映射` 。

可以结合 `webpack` 的 `alias` 去理解这个概念，在结合 `webpack` 进行开的时候我们也需要通过 `paths` 和 `alias`去做一个配置

> \1. 在解析非相对模块时，编译器会首先通过声明映射进行文件的查找
> \2. 声明映射并不会影响编译后导入模块的路径，因为 Typescript 只是用声明映射去寻找声明文件，且编译并不会转换这些映射

## 4.4、traceResolution

启用编译器的模块解析跟踪，它会告诉我们在模块解析过程中发生了什么

例如：在解析导入 src/app.ts 时有如下输出

```text
======== Resolving module 'typescript' from 'src/app.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
```

## 4.5、noResolve

> 设置了 noResolve 为 true ，任何不被包含的文件都不会被包含到编译上线文中

正常来讲编译器会在开始编译之前解析模块导入。 每当它成功地解析了对一个文件 `import`，这个文件被会加到一个文件列表里，以供编译器稍后处理。

`--noResolve`编译选项告诉编译器不要添加任何不是在命令行上传入的文件到编译列表。 编译器仍然会尝试解析模块，但是只要没有指定这个文件，那么它就不会被包含在内。

例如：

```ts
// app.ts
import * as A from "moduleA" // OK, moduleA passed on the command-line
import * as B from "moduleB" // Error TS2307: Cannot find module 'moduleB'.
```



```powershell
tsc app.ts moduleA.ts --noResolve
```

使用`--noResolve`编译`app.ts`：

- 可能正确找到`moduleA`，因为它在命令行上指定了。
- 找不到`moduleB`，因为没有在命令行上传递。

## 五、注意

## 5.1、exclude列表里的模块还会被编译器使用

`tsconfig.json`将文件夹转变一个“工程” 如果不指定任何 `“exclude”`或`“files”`，文件夹里的所有文件包括`tsconfig.json`和所有的子目录都会在编译列表里。 如果你想利用 `“exclude”`排除某些文件，甚至你想指定所有要编译的文件列表，请使用`“files”`。

有些是被`tsconfig.json`自动加入的。 它不会涉及到上面讨论的模块解析。 如果编译器识别出一个文件是模块导入目标，它就会加到编译列表里，不管它是否被排除了。

因此，要从编译列表中排除一个文件，你需要在排除它的同时，还要排除所有对它进行`import`或使用了`/// <reference path="..." />`指令的文件

## 5.2、非相对模块按照`模块解析`失败后并不会马上报错，它会继续去尝试定位 [外部模块声明](https://link.zhihu.com/?target=https%3A//www.tslang.cn/docs/handbook/modules.html%23ambient-modules)