# vue + intro轻松实现前端新手引导效果

在使用某些网站的新版页面的时候，会遇到类似于新手引导的效果，引导用户去了解新版页面的功能或者效果，那么你知道是怎么实现的吗？其实只需要vue + intro.js几步就能实现，赶紧来看一看吧~~~

## 一、效果展示

![img](https://pic2.zhimg.com/v2-12c1e04f7c22b4b204df8ad700216ef1_b.webp)

那激动人心的时刻到了，我们如何vue中使用 Intro.js 在呢？

## 二、今天的猪脚Intro.js

**2.1、Intro.js的安装**

```
Intro.js`是一个轻量级的`js`库，用于创建一步一步的产品引导，支持使用键盘的前后方向键导航，使用 Enter 和 ESC 键推出引导，您可以通过几个简单的步骤安装`Intro.js
```

[Intro.js - Lightweight, user-friendly onboarding tour libraryintrojs.com![图标](https://pic2.zhimg.com/v2-fb935711d6204e4877cbe3ffb1fcb3c1_180x120.jpg)](https://link.zhihu.com/?target=https%3A//introjs.com/)

我们引入下述文件

```html
<link rel="stylesheet" href="https://unpkg.com/intro.js/minified/introjs.min.css">
<script src="https://unpkg.com/intro.js/minified/intro.min.js"></script>
```

**2.2、Intro.js基本使用**

接着在HTML文件中加入基本结构

```js
<div data-step="1" data-intro="第一步，欢迎！">欢迎，这是第一步。</div>
<div data-step="2" data-intro="第二步，你好！">你好，这是第二步。</div>
<div data-step="3" data-intro="第三步，大家好！">大家好，这是第三步。</div>
```

`data-step`是步骤，`data-intro`是对每一步的介绍。

最后我们加入JS代码就可以通过浏览器运行查看效果啦(*￣︶￣)

```js
<script>
introJs().setOptions({
    nextLabel: '下一个  &rarr;',    // 下一个按钮文字
    prevLabel: '&larr; 上一个',     // 上一个按钮文字
    skipLabel: '跳过',              // 跳过按钮文字
    doneLabel: '立即体验',           // 完成按钮文字
    hidePrev: true,                 // 在第一步中是否隐藏上一个按钮
    hideNext: true,                 // 在最后一步中是否隐藏下一个按钮
    exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
    showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
    disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
    showBullets: false          // 是否显示面板指示点
}).start();
</script>
```

![img](https://pic2.zhimg.com/v2-a6a30ea1d66581c02a787d4ec3c118d9_b.webp)

感觉如何，是不是很简单，接下来我们学习如何在VUE项目中使用

## 三、 在vue-cli项目中使用

3.1、准备

首先打开项目，下载Intro.js模块

```js
//使用yarn
yarn add Intro.js

//npm
npm i Intro.js -S

//cnpm
cnpm i Intro.js -S
```

3.2、使用

找到需要加新手引导的组件，导入Intro.js组件和样式

```js
import introJs from 'intro.js'
import 'intro.js/introjs.css'
```

在`methods`中封装`guide`方法

```js
// 导出组件数据
export default {
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
```

接着在钩子函数`mounted`中调用

```js
import introJs from 'intro.js'
import 'intro.js/introjs.css'

// 导出组件数据
export default {
    // 钩子函数
    mounted() {
        this.guide()
    },
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
```

最后就是给需要加引导的盒模型加属性就大功告成了

```js
data-step="步骤数字" data-intro="每一步的介绍字符串"
```

全部参考代码

```vue
<template>
<div class="admin">

    <!-- 
    <section class="menu">
        <ul>
            <li data-step="1" data-intro="1" >测试1</li>
            <li data-step="2" data-intro="2" >测试2</li>
            <li data-step="3" data-intro="3" >测试3</li>
            <li data-step="4" data-intro="4" >测试4</li>
        </ul>
    </section>
    --> 

    <!-- 左侧导航 --> 
    <div class="menu" v-bind:style="{width: menuWStyle}"  data-step="1" data-intro="导航菜单">
        <!-- <el-radio-group v-model="isHiddenMenu" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <el-menu 
            v-loading="menuLoading"
            :default-active="$route.path" 
            class="el-menu-vertical-demo"
            :collapse="isHiddenMenu"
            :collapse-transition="false"
            background-color="#263445"
            text-color="rgb(191, 203, 217)"
        >
            <el-submenu v-for="(firstItem) in menus" :index="firstItem.auth_id" :key="firstItem.auth_id">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{firstItem.auth_name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item 
                        v-for="twoItem in firstItem.children"
                         :key="twoItem.auth_id"
                        :index="twoItem.url" 
                        @click="jump(twoItem.url)"
                    ><i class="el-icon-setting"></i>{{twoItem.auth_name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

        </el-menu>
    </div>
    <!-- /左侧导航 -->
    <!-- 右侧内容 -->
    <div class="main">
        <!-- 顶部 -->
        <div class="top">
            <div class="l">
                <div class="btn" @click="changeMenuFn">
                    <!-- <i class="el-icon-s-fold"></i> -->
                    <i v-bind:class="changeMenuIcon"></i>
                </div>
                <div class="breadcrumb">
                    <Breadcrumb v-bind:name1="name1" v-bind:name2="name2" />
                </div>
            </div>
            <div class="r">
                <span data-step="2" data-intro="用户名（角色）">{{uname}}（{{rolename}}）</span>
                <i    data-step="3" data-intro="退出登录" class="el-icon-switch-button"></i>
                <i    data-step="4" data-intro="窗口全屏" class="el-icon-full-screen"></i>
            </div>
        </div>
        <!-- /顶部 -->
        <!-- 内容 -->
        <div class="content" data-step="5" data-intro="主体内容" >
            <transition appear name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
        <!-- /内容 -->
    </div>
    <!-- /右侧内容 -->
</div>
</template>

<script>
// 导出组件数据
import introJs from 'intro.js'
import 'intro.js/introjs.css'

// 导出组件数据
export default {
    // 钩子函数
    mounted() {
        this.guide()
    },
    // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
```