var page = require('webpage').create();
var colour = require('colour');

colour.setTheme({
  checkmark: 'green',
  fail: 'red',
  success: 'green bold'
});

page.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit();
};

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
    page.injectJs('../node_modules/mocha/mocha.js');
    page.injectJs('../index.js');
    page.injectJs('../node_modules/chai/chai.js');
    page.injectJs('test_index.js');
    page.evaluateJavaScript('function(){ mocha.run() }');
  }else{
    console.error('open index.html failed');
  }
})

