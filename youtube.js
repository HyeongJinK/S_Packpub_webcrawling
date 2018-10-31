var fs = require('fs');
var youtubedl = require('youtube-dl');
//https://www.youtube.com/watch?v=XcFUsdxsP_w
//https://www.youtube.com/watch?v=4eDip_8JiyE
var video = youtubedl('https://www.youtube.com/watch?v=4eDip_8JiyE',

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