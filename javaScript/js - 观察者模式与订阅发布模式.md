# js - 观察者模式与订阅发布模式



发布订阅模式与观察者模式的不同，“第三者” （事件中心）出现。目标对象并不直接通知观察者，而是通过事件中心来派发通知。



# 三、两种模式的关联和区别

发布订阅模式更灵活，是进阶版的观察者模式，指定对应分发。

1. 观察者模式维护单一事件对应多个依赖该事件的对象关系；
2. 发布订阅维护多个事件（主题）及依赖各事件（主题）的对象之间的关系；
3. 观察者模式是目标对象直接触发通知（全部通知），观察对象被迫接收通知。发布订阅模式多了个中间层（事件中心），由其去管理通知广播（只通知订阅对应事件的对象）；
4. 观察者模式对象间依赖关系较强，发布订阅模式中对象之间实现真正的解耦。



```javascript
var pubsub = (function(){
    var q = {}
    topics = {},
    subUid = -1;
    //发布消息
    q.publish = function(topic, args) {
        //判断有没有当前的话题
        if(!topics[topic]) {return;}
        var subs = topics[topic],//当前话题订阅者数组
        len = subs.length;
        while(len--) {
            subs[len].func(topic, args);
        }
        return this;
    };
    //向订阅中心添加订阅
    //接收两个参数 要订阅的话题，处理程序
    q.subscribe = function(topic, func) {
        //如果当前话题已经有订阅者，获取到订阅者数组
        //一个话题名下的 订阅者事件可以是多个fn1, fn2, fn3
        topics[topic] = topics[topic] ? topics[topic] : [];

        //给每个订阅者添加唯一的token
        var token = (++subUid).toString();
        topics[topic].push({
            token : token,
            func : func
        });
        return token;
    };
    //取消订阅
    q.unsubscribe = function(token){
        Object.keys(topics).map( key => {
            topics[key].map((fn, fnIndex) => {
                if(fn.token == token){
                    topics[key].splice(fnIndex,1)
                }
            })
        })
    }
    return q;
})();
//触发的事件(订阅者的处理程序)
var logmsg1 = function(topics, data) {
    console.log("logging1:" + topics + ":" + data);
}

var logmsg2 = function(topic, data) {
    console.log("logging2:" + topic + ":" + data,'我是订阅者2');
}
//监听指定的消息'msgName'
var sub1 = pubsub.subscribe('msgName', logmsg1);
var sub2 = pubsub.subscribe('msgName', logmsg2);
//pubsub.unsubscribe(sub1)
//发布消息'msgName'
pubsub.publish('msgName', 'hello world');
//发布无人监听的消息'msgName1'
pubsub.publish('anotherMsgName', 'me too!');
```

