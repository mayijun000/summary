# ajax原理



ajax的核心就是基于浏览器提供的XMLHttpRequest对象实现的



原理：由事件触发，创建一个XMLHttpRequest对象，把HTTP方法和目标，以及请求返回后的回调函数设置到XMLHttpRequest对象，通过向服务器发送请求，请求发送后继续响应用户的界面交互，只有等到请求真正从服务器返回的时候才调用callback()函数，对响应数据进行处理。



```javascript
1     //创建XMLHttpRequest对象，为考虑兼容性问题，老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象
2     var ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
3     
4     //设定请求的类型，服务器URL，以及是否异步处理
5     ajax.open("get","test.ashx?name=jcx&id="+new Date(),true);
6                 
7     ajax.onreadystatechange=function(){
9          //4:请求已完成，且响应已就绪    
10         if(ajax.readyState==4){
12             //200:成功
13             if(ajax.status==200){
15             	  //处理结果
16                alert(ajax.responseText);
17              }else{
19                   alert("AJAX服务器返回错误！");
20              }
21          }       
23     }
24     //将请求发送到服务器
26     ajax.send();
```

