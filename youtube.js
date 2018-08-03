var fs = require('fs');
var youtubedl = require('youtube-dl');

//https://www.youtube.com/watch?v=fp-uPpA99bQ
//https://www.youtube.com/watch?v=WP4mWT7EaNg
var video = youtubedl('https://www.youtube.com/watch?v=WP4mWT7EaNg',

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