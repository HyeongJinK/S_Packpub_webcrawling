var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');
 
function playlist(url) {
 
  'use strict';
  var video = ytdl(url);
 
  video.on('error', function error(err) {
    console.log('error 2:', err);
  });
 var size = 0;
  video.on('info', function(info) {
    size = info.size;
    console.log(info._filename);
    video.pipe(fs.createWriteStream("./download/"+info._filename));
  });
 
  var pos = 0;
  video.on('data', function data(chunk) {
    pos += chunk.length;
    // `size` should not be 0 here.
    if (size) {
      var percent = (pos / size * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + '%');
    }
  });
 
  video.on('next', playlist);
 
}
//https://www.youtube.com/watch?v=5GmnfYWe7WA&list=PLFoH8spXdgNE4Wz9-WZ8Yd8TbTpRq1Wqa
playlist('https://www.youtube.com/playlist?list=PLFoH8spXdgNEidI7YRa87uk22A5Ex1acK');

