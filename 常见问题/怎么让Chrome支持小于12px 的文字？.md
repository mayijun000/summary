# **怎么让Chrome支持小于12px 的文字？**

这个我们在做移动端的时候，设计师图片上的文字假如是10px，我们实现在网页上之后。往往设计师回来找我们，这个字体能小一些吗？我设计的是10px？为啥是12px?其实我们都知道，谷歌Chrome最小字体是12px，不管你设置成8px还是10px，在浏览器中只会显示12px，那么如何解决这个坑爹的问题呢？

————————————————

我们的做法是：

针对chrome浏览器,加webkit前缀，用transform:scale()这个属性进行放缩.



```text
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style type="text/css">
            span{
                font-size: 12px;
                display: inline-block;
                -webkit-transform:scale(0.8);
            }
        </style>
    </head>
    <body>
        <span>测试10px</span>
    </body>
</html>
```