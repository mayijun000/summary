# AJAX、axios、fetch的区别

**AJAX**

Gmail开发人员发现IE里面有个XMLHTTPRequest对象来请求数据时，可以实现无刷新数据请求，所以使用这个特性，进行网络数据请求，这就是AJAX的由来。

AJAX不是一个单词，他的全称是Asynchronous JavaScript and XML，就是异步的JavaScript和XML，它是一套用于创建快速动态网页的技术标准，使用步骤如下：

1. 创建异步XMLHttpRequest对象
2. 设置请求参数，包括请求的方法和URL等
3. 发送请求
4. 注册事件，事件状态变更会及时响应监听
5. 在监听里面获取并处理返回数据

所以AJAX的核心就是XMLHttpRequest对象，这是一个非常早的实现方法，也是兼容性最好的，已经成为了浏览器标准，虽然我们现在都使用其它的API规范，但对象名字暂时还是用XML命名



**axios**

axios是一个基于Promise的HTTP库，可以用在浏览器和node.js中，它底层还是基于XMLHttpRequest对象的，你可以认为它是一个方便的封装库，除了基础请求数据，它还增加了如下功能：

1. 对PromiseAPI的支持
2. 支持请求拦截和响应、转换请求数据和响应数据、取消请求
3. 可以自动转换JSON数据
4. 支持防御XSRF

**fetch**

fetch就不是XMLHttpRequest对象了，fetch是原生的js对象，也就是说，它不依赖浏览器，fetch提供了一个理解的请求替换方案，可以提供给其它技术使用。我们主要需要了解下fetch和ajax的本质区别：

1. fetch返回的是Promise，所以如果HTTP状态码是404之类的，fetch也是成功返回的，只有在网络连接错误的情况下，才会reject
2. fetch不发送cookies

fetch的请求写法会比AJAX简单许多，但我想，最主要的问题是，无法区分HTTP状态码了，这个在编程时还是比较常用的，所以我们目前还是使用axios比较多，而很少使用fetch