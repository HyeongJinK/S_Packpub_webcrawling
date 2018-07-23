var fs = require('fs');
var youtubedl = require('youtube-dl');
<<<<<<< HEAD
//https://www.youtube.com/watch?v=6e56m9FgItI
//https://www.youtube.com/watch?v=G4Dn6c5iX9A
//https://www.youtube.com/watch?v=pRPooPdWrdc
//https://www.youtube.com/watch?v=3bS615giLXI
//https://www.youtube.com/watch?v=kd-vtICtcRQ
//https://www.youtube.com/watch?v=W6jwzyAUhsc

var video = youtubedl('https://www.youtube.com/watch?v=W6jwzyAUhsc',
=======
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


//https://www.youtube.com/watch?v=VlTC7VdRgFM
//https://www.youtube.com/watch?v=pDz7J0aH38o
//https://www.youtube.com/watch?v=ifHsZ3XAw4Y
//https://www.youtube.com/watch?v=gplD00GbZ58
//https://www.youtube.com/watch?v=p7xvX9tUeYw


//https://www.youtube.com/watch?v=pvCc-Ahrn5k
//https://www.youtube.com/watch?v=V8i3I-Y_DoY
//https://www.youtube.com/watch?v=akZrbDj4ttA
//https://www.youtube.com/watch?v=VoOBoqFoKko
//https://www.youtube.com/watch?v=CtwlHtQU_DA
//https://www.youtube.com/watch?v=8JviGG_Bf3A
//https://www.youtube.com/watch?v=j3vDV8yLlAY
//https://www.youtube.com/watch?v=xQApfdx9Z-o
//https://www.youtube.com/watch?v=SVzZJKevWW0
//https://www.youtube.com/watch?v=QeE9RtwzeMI
//https://www.youtube.com/watch?v=Xww7dFj64Aw
//https://www.youtube.com/watch?v=sTotZM3gs8o
//https://www.youtube.com/watch?v=dZCjp_IfBrk



//https://www.youtube.com/watch?v=vb3MmGiSJj8
//https://www.youtube.com/watch?v=xFhQdu6E8nA
//https://www.youtube.com/watch?v=JS_LWR0MgIQ
//https://www.youtube.com/watch?v=SeLCCVrt0YI
//https://www.youtube.com/watch?v=5t0pzJ27zmQ
//https://www.youtube.com/watch?v=k7AHtjIS3lE



/**
https://www.youtube.com/watch?v=sT_i22KSWk8
https://www.youtube.com/watch?v=JtwQf_P7yyM
https://www.youtube.com/watch?v=l4ysVbZJ4TE
https://www.youtube.com/watch?v=6UqFMYTR8W4
https://www.youtube.com/watch?v=im3X-sU0CBo
https://www.youtube.com/watch?v=1XmW7Xi006c
https://www.youtube.com/watch?v=VLJAD564M50 

https://www.youtube.com/watch?v=IRofFiRLeVY
https://www.youtube.com/watch?v=NUUx6ZiiO2g
https://www.youtube.com/watch?v=k1bjdnddk3k
https://www.youtube.com/watch?v=FoSX9Ngr4Iw
https://www.youtube.com/watch?v=Lf1bEm6XSC8
https://www.youtube.com/watch?v=1z8v0c5ePzs
https://www.youtube.com/watch?v=hIok_y_KCe4
https://www.youtube.com/watch?v=8MnWChe3eoI

https://www.youtube.com/watch?v=Xa1Urk_jO4g
https://www.youtube.com/watch?v=RFxxBw1J4Pg
https://www.youtube.com/watch?v=4ovHvlDLdrE
https://www.youtube.com/watch?v=3o6KIKNcvhU
https://www.youtube.com/watch?v=OamWYK50ahU
https://www.youtube.com/watch?v=xfIrPCe6ask
*/
var video = youtubedl('https://www.youtube.com/watch?v=xfIrPCe6ask',
>>>>>>> parent of 0b33292... 그 동안 변경된 거 걍 커밋
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