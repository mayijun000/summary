# Http状态码

- 200("OK")
  一切正常。实体主体中的文档（若存在的话）是某资源的表示。

- 500("Bad Request")
  客户端方面的问题。实体主题中的文档（若存在的话）是一个错误消息。希望客户端能够理解此错误消息，并改正问题。

- 500("Internal Server Error")
  服务期方面的问题。实体主体中的文档（如果存在的话）是一个错误消息。该错误消息通常无济于事，因为客户端无法修复服务器方面的问题。

- 503 服务器维护

- 301重定向。永久移动

- 302重定向。临时移动

  这种情况下，服务器返回的头部信息中会包含一个 Location 字段，内容是重定向到的url。

- 303查看其它地址。与301类似。使用GET和POST请求查看

- 304未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源

- 400 客户端请求的语法错误，服务器无法理解

- 401 请求要求用户的身份认证

- 403 服务器理解请求客户端的请求，但是拒绝执行此请求

- 404("Not Found") 和410("Gone")

当客户端所请求的URI不对应于任何资源时，发送此响应代码。404用于服务器端不知道客户端要请求哪个资源的情况；410用于服务器端知道客户端所请求的资源曾经存在，但现在已经不存在了的情况。