var Service = require('node-windows').Service;

var svc = new Service({
  name:'News Monkey',
  description: 'A newsBot for programmers which will deliver top news from \'https://hckrnews.com/\' on a daily basis via email.',
  script: './index.js'
});

svc.on('stop',function(){
    svc.start();
});

svc.on('start',function(){
    console.log("Restarted!");
});

svc.stop();
