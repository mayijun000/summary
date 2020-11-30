/**
 * @description 模块加载相关函数
 * @date 2020-03-11
 * @author mayijun
 */

import router from '@/router/index.js'
import store from '@/store'
import {setSessionStore} from '@/utils/util.js'

/**
 * @description 前端定义注册路由的方法
 */
const registeredRouter = () => {
	// require.context 自动化注册所有配置
	const routersComponents = require.context('@/modules', true, /index.js$/);
	let routerArray = [];
	let storeArray = [];
	// fileName: './login/login.router.js'
	routersComponents.keys().forEach((fileName) => { 
	    const routerConfig = routersComponents(fileName);
		routerArray = routerArray.concat(routerConfig.router);
		// 获取系统名称
		let paths = fileName.split("/");
		if(routerConfig.store != undefined){
			storeArray[paths[1]] = routerConfig.store;
		}
	});
	// 动态注册路由
	router.addRoutes(routerArray);
	setSessionStore("routerArray",routerArray);

	if(storeArray){
		for (let key in storeArray) {
			//防止切换角色重复注册
			if (store.state[key]) {
			    store.unregisterModule(key);
			}
			// 动态注册store
			store.registerModule(key,storeArray[key]);
		}
		setSessionStore("storeArray",storeArray);
	}

}

/**
 * @description 获取模块打包后的标准入口 JS 文件
 * @param {String} modName 
 */
// const getModResources = modName => {
// 	if (process.env.NODE_ENV === 'development') {
// 		// 开发环境用 es6 模块加载方式，方便调试
// 		return import(`@/modules/${modName}/index.js`).then(res => {
// 			return res;
// 		});
// 	} else {
// 		return new Promise((resolve, reject) => {
// 			_requirejs(['/modules/' + modName + '/index.js'], mod => {
// 				resolve(mod);
// 			});
// 		});
// 	}
// }

export {
	registeredRouter,
	//getModResources,
}
