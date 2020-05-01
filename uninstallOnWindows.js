var Service = require('node-windows').Service;
const fs = require('fs')

var svc = new Service({
  name:'News Monkey',
  description: 'A newsBot for programmers which will deliver top news from \'https://hckrnews.com/\' on a daily basis via email.',
  script: './index.js'
  // Path to your script
});

svc.on('uninstall',function(){
    fs.writeFileSync('./config.txt', '');
    console.log('News Monkey Uninstalled!');
    console.log('Thank You!');
});

svc.uninstall();