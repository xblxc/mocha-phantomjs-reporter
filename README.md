## Mocha-Phantomjs-Reporter
如果想在phantomjs中使用mocha，比较方便的我们可以使用[mocha-phantomjs](https://github.com/nathanboktae/mocha-phantomjs)，用例代码如下：

```
<html>
  <head>
    <meta charset="utf-8">
    <!-- encoding must be set for mocha's special characters to render properly -->
    <link rel="stylesheet" href="mocha.css" />
  </head>
  <body>
    <div id="mocha"></div>
    <script src="mocha.js"></script>
    <script src="chai.js"></script>
    <script>
      mocha.ui('bdd')
      expect = chai.expect
    </script>
    <script src="src/mycode.js"></script>
    <script src="test/mycode.js"></script>
    <script>
      mocha.run()
    </script>
  </body>
</html>
```
他的优势在于其方便的集成，使用简单，支持绝大部分reporter，但是依然满足不了我目前的需求；使用phantomjs，我们最大的目的是进行自动化测试，对于已有的静态页面或者服务器页面，我们想对其进行自动化测试，最好的办法是测试单独隔离开，不和他们有任何耦合的地方，这样才是最理想的方案。但是由上面的例子我们可以发现，mocha及相关设置必须事先写入页面当中，当然使用gulp可以完成这类任务，但是因为测试而去改变已有的模板，这是没法容忍的。我们能不能在测试时，动态注入mocha了？

翻看[phantomjs](http://phantomjs.org/)的文档，最终找到了解决方案，本项目采用了phantomjs的`injectJs`，以及`onCallback`配合沙盒里面的`window.callPhantom`（这种通信方式类似html5中的postMessage），最终完美的将mocha的测试信息返回到控制台！

```
...
page.onCallback = function(data) {
  if(!data){
    phantom.exit();
  }
  data = data.map(function(n){
    if(/^\{(.+)\|(.+)\}$/.test(n)){
      return RegExp.$1[RegExp.$2]
    }else{
      return n;
    }
  })
  console.log.apply(console, data);
}
page.open('index.html', function(status){
  if(status){
    page.injectJs('node_modules/mocha/mocha.js');
    page.injectJs('reporters/log.js');
    page.injectJs('node_modules/chai/chai.js');
    page.injectJs('index.js');
    page.evaluateJavaScript('function(){ mocha.run() }');
  }else{
    console.error('open index.html failed');
  }
})

```

从此测试与html模板成功分离。
