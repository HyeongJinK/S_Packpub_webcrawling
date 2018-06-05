var fs = require('fs');
var youtubedl = require('youtube-dl');
let filename;
//https://www.youtube.com/watch?v=r5IzCA3aNTo
//https://www.youtube.com/watch?v=RGm1HhwGjrc
//https://www.youtube.com/watch?v=quA_3XdRA0E
//https://www.youtube.com/watch?v=c7mwYpbupx4
//https://www.youtube.com/watch?v=8ouRa2wHtHQ
//https://www.youtube.com/watch?v=dXArQsMvM-Y
//https://www.youtube.com/watch?v=Oy_HKmigg7g
//https://www.youtube.com/watch?v=WE3-YSTCydU
//https://www.youtube.com/watch?v=VZTeadiiX70
//https://www.youtube.com/watch?v=JGIXp5uxp-M

//https://www.youtube.com/watch?v=o32w-kcDekY
//https://www.youtube.com/watch?v=zWrDmwdkbT4
//https://www.youtube.com/watch?v=KGw8NgsI5pI
//https://www.youtube.com/watch?v=cY6Vcyp-LlM
//https://www.youtube.com/watch?v=LIsjIOxS0uU
//https://www.youtube.com/watch?v=mlIjEtKhiB0
//https://www.youtube.com/watch?v=nTBHnkSM2Tg
var video = youtubedl('https://www.youtube.com/watch?v=nTBHnkSM2Tg',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });

//Will be called when the download starts.
video.on('info', function(info) {
  //console.log('Download started');
  //console.log('filename: ' + info._filename);
  filename = info._filename;
  video.pipe(fs.createWriteStream("./download/"+info._filename));
  //console.log('size: ' + info.size);
  
});

