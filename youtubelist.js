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
    console.log("\n" + info._filename);
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
//PLFoH8spXdgNFPgSiQR4JuZPz9mxecgBo0
//PLFoH8spXdgNFdScIFw1gL-1lSr_e9D07b
//PLFoH8spXdgNHUPpEhqktU9IPawKXFpn4B
//PLFoH8spXdgNGBWTpdSX2GyZunmn0_oThl
//PLFoH8spXdgNEfNduCuZmwjLzg9ofY_ZZC
//PLFoH8spXdgNE69tdZlGB92KNWBXr6_Nqa
//PLFoH8spXdgNGU-UFwASZvjN3frQ1d97nr
playlist('https://www.youtube.com/playlist?list=PLFoH8spXdgNGU-UFwASZvjN3frQ1d97nr');