var Service = require('node-linux').Service;

var svc = new Service({
    name:'News Monkey',
    description: 'A newsBot for programmers which will deliver top news from \'https://hckrnews.com/\' on a daily basis via email.',
    script: './index.js'
    // Path to your script
  });
  
  svc.on('stop',function(){
      svc.start();
  });
  
  svc.stop();
  