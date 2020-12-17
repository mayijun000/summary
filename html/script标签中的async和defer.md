# script标签中的async和defer

### defer

如果script标签设置了该属性，则浏览器会异步的下载该文件并且不会影响到后续DOM的渲染；
如果有多个设置了defer的script标签存在，则会按照顺序执行所有的script；
defer脚本会在文档渲染完毕后，DOMContentLoaded事件调用前执行。

### async

async的设置，会使得script脚本异步的加载并在允许的情况下执行
async的执行，并不会按着script在页面中的顺序来执行，而是谁先加载完谁执行。