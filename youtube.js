var fs = require('fs');
var youtubedl = require('youtube-dl');
//https://www.youtube.com/watch?v=6e56m9FgItI
//https://www.youtube.com/watch?v=G4Dn6c5iX9A
//https://www.youtube.com/watch?v=pRPooPdWrdc
//https://www.youtube.com/watch?v=3bS615giLXI
//https://www.youtube.com/watch?v=kd-vtICtcRQ
//https://www.youtube.com/watch?v=W6jwzyAUhsc

var video = youtubedl('https://www.youtube.com/watch?v=W6jwzyAUhsc',
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