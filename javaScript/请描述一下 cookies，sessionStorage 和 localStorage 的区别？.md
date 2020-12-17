# 请描述一下 cookies，sessionStorage 和 localStorage 的区别？

### **cookie:**

o  cookie是网站为了**标示用户身份**而储存在用户本地终端（Client Side）上的数据（通常经过加密）。

o  cookie数据**始终在同源的http请求中携带**（即使不需要），记会在浏览器和服务器间来回传递。

 **sessionStorage****和localStorage**不会自动把数据发给服务器，仅在本地保存。

### **存储大小：**

o  cookie数据大小不能超过4k。

o  sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

###  **有期时间**：

o  localStorage  存储**持久数据**，浏览器关闭后数据不丢失除非主动删除数据；

o  sessionStorage 数据在当前浏览器窗口关闭后自动删除。

o  cookie      设置的cookie**过期时间之前**一直有效，即使窗口或浏览器关闭

### **作用域不同:**

o  sessionStorage**不在**不同的浏览器窗口中共享，即使是同一个页面；

o  localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。