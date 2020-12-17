# vue-router 使用params与query传参有什么区别

`vue-router` 可以通过 `params` 与 `query` 进行传参

```js
// 传递
this.$router.push({path: './xxx', params: {xx:xxx}})
this.$router.push({path: './xxx', query: {xx:xxx}})
 
// 接收
this.$route.params
 
this.$route.query
```

- `params` 是路由的一部分,必须要有。`query` 是拼接在 `url` 后面的参数，没有也没关系
- params 不设置的时候，刷新页面或者返回参数会丢，query 则不会有这个问题