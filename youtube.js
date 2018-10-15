var fs = require('fs');
var youtubedl = require('youtube-dl');

//w8B8H9-2v8I
//V6qJGG-a-bc
//a0XguaVkRyY
//R6qoefiWUjk
//N_l7OsD5uNQ
//c_M9QhvLh04
//AGBVXMaqqcs
//_Y3t6_074kA
//dvjFEPwDkBI
//Y6xy3W0AMsw
//ny55OIQmzxo
//BhAbLaTS4O0
https://www.youtube.com/watch?v=zgv9NlE2-Vo&t=1s
var video = youtubedl('https://www.youtube.com/watch?v=zgv9NlE2-Vo',

  ['--format=18'],
  { cwd: __dirname });

let size = 0;
video.on('info', function(info) {
  size = info.size;
  video.pipe(fs.createWriteStream("./download/"+info._filename));  
});

let pos = 0;
video.on('data', function data(chunk) {
  pos += chunk.length;
  if (size) {
    var percent = (pos / size * 100).toFixed(2);
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
    process.stdout.write(percent + '%');
  }
});
 
video.on('end', function() {                                                                                                                                                                                                                                                                                                                                                    
  console.log('finished downloading!');
});