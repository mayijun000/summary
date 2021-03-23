# vue动态主题切换（elementui+webpack-theme-color-replacer）

利用webpack-theme-color-replacer插件，为elementui实现了在运行时动态切换主题色的功能，无需在页面进行scss的编译，提升了切换速度。

### 一、安装webpack-theme-color-replacer

```js
npm install webpack-theme-color-replacer
```

### 二、基于vue/cli3脚手架的配置文件vue.config.js

```js
//引入插件
const ThemeColorReplacer = require('webpack-theme-color-replacer');
//动态切换elementui主题，需要用到
const forElementUI = require('webpack-theme-color-replacer/forElementUI');
//所有主题的颜色变量都放在这里
var { themeColor } = require('./src/utils/theme_common.js');

//主题切换插件配置
configureWebpack: {
    plugins: [
        //生成仅包含颜色的替换样式（主题色等）
        new ThemeColorReplacer({
            fileName: 'static/css/theme-colors.[contenthash:8].css',
            matchColors: [...forElementUI.getElementUISeries('#409EFF'), ...themeColor['#409EFF']],
            changeSelector: forElementUI.changeSelector,
            isJsUgly: process.env.NODE_ENV !== 'development',
        })
    ]
},
```

theme_common.js主题颜色文件

```js
//默认主题颜色数组
const defaultThemeArray = ['#409EFF', '#606266', '#ffffff', '#f2f2f2', '#c0c4cc', '#67c23a', '#ecf5ff',
	'#ebeef5', '#fafafa', '#909399', '#e6a23c'
];
//绿色主题
const greenThemeArray = ['#09900f', '#606266', '#ffffff', '#f2f2f2', '#c0c4cc', '#67c23a', '#ecf5ff',
	'#ebeef5', '#fafafa', '#909399', '#e6a23c'
];
//根据需求，自己定义相应的数据结构
exports.themeColor = {
	"#409EFF": defaultThemeArray,
	"#000000": defaultThemeArray,
	"#ffffff": defaultThemeArray,
	"#09900f": greenThemeArray,
}
```

### 三、主题切换方法theme_color_client.js

```js
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
import {themeColor} from '@/utils/theme_common.js'

//默认主题颜色
export let curColor = "#409EFF";

// 动态切换主题色
export function changeThemeColor(newColor) {
    var options = {
        newColors: [...forElementUI.getElementUISeries(newColor), ...themeColor[newColor]],
    }
    return client.changer.changeColor(options, Promise)
        .then(t => {
            curColor = newColor
            localStorage.setItem('theme_color', curColor)
        });
}

export function initThemeColor() {
    const savedColor = localStorage.getItem('theme_color')
    if (savedColor) {
        curColor = savedColor
        changeThemeColor(savedColor)
    }
}
```

### 四、主题切换初始化

在main.js文件中初始化主题

```js
// 主题换肤
import { initThemeColor } from './utils/theme_color_client.js'

initThemeColor();
```

### 五、主题切换下拉框组件

```vue
<template>
	<el-select v-model="mainColor" @change="changeColor">
		<el-option label="蓝色" value="#409EFF"></el-option>
		<el-option label="黑色" value="#000000"></el-option>
		<el-option label="白色" value="#ffffff"></el-option>
		<el-option label="绿色" value="#09900f"></el-option>
	</el-select>
</template>

<script>
    import { changeThemeColor, curColor } from '@/utils/theme_color_client.js'
    export default {
        data() {
            return {
                mainColor: curColor,
            };
        },
        methods: {
            changeColor(newColor) {
                changeThemeColor(newColor)
                    .then(t => console.log('主题色切换成功~'))
            }
        },
    }
</script>
```

### 按照自己工程的架构，颜色可以由scss变量统一管理common.css

```css
//默认主题
$default-them-color:#409EFF;//默认主题颜色
$default-text-color:#606266;//默认文字颜色
$default-theme-white-color:#ffffff;//默认主题白色
$default-page-bg-color:#f2f2f2;//默认页面背景颜色
$default-disabled-color:#c0c4cc;//禁用时的颜色
$default-upload-success-icon-color:#67c23a;//文件上传成功图标颜色
$default-menu-active-bg-color:#ecf5ff;//菜单激活选中时的背景颜色
$default-table-info-color:#ebeef5;//表格边框颜色
$default-table-header-color:#fafafa;//表格表头颜色
$default-message-info-color:#909399;//消息提示框文字颜色
$default-message-info-icon-color:#e6a23c;//消息提示框图标颜色
```

在main.js中配置可以进行全局引用

```js
//设置scss变量全局引用
const oneOfsMap = config.module.rule('scss').oneOfs.store;
oneOfsMap.forEach(item => {
	item.use('sass-resources-loader')
		.loader('sass-resources-loader')
		.options({
			resources: path.resolve(__dirname, 'src/assets/styles/common.scss'),
		})
		.end()
});
```

