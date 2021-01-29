# Http协议首部字段

1、通用首部字段（请求报文与响应报文都会使用的首部字段）

·     Date：创建报文时间

·     Connection：连接的管理

·     Cache-Control：缓存的控制

·     Transfer-Encoding：报文主体的传输编码方式

2、请求首部字段（请求报文会使用的首部字段）

·     Host：请求资源所在服务器

·     Accept：可处理的媒体类型

·     Accept-Charset：可接收的字符集

·     Accept-Encoding：可接受的内容编码

·     Accept-Language：可接受的自然语言

3、响应首部字段（响应报文会使用的首部字段）

·     Accept-Ranges：可接受的字节范围

·     Location：令客户端重新定向到的URI

·     Server：HTTP服务器的安装信息

4、实体首部字段（请求报文与响应报文的的实体部分使用的首部字段）

·     Allow：资源可支持的HTTP方法

·     Content-Type：实体主类的类型

·     Content-Encoding：实体主体适用的编码方式

·     Content-Language：实体主体的自然语言

·     Content-Length：实体主体的的字节数

·     Content-Range：实体主体的位置范围，一般用于发出部分请求时使用