// //npm install fyda

//const fyda = require('fyda');
// fyda.downloadMp3('https://www.youtube.com/watch?v=KMU0tzLwhbE', '.', 'developers.mp3');
//  fyda.downloadMp4('https://www.youtube.com/watch?v=TFMzvQ0MojE'
//  , '.'
//  , 'test.mp4');

var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("./download/file.mp4");

var request = https.get("https://serviceapi.nmv.naver.com/flash/convertIframeTag.nhn?vid=F3BB2875769B5686D441F3B98C7BC24A4FB2&outKey=V126a890806ca3e2b7fee95e66df743b5a0d66148f8f6a246d8ac95e66df743b5a0d6"
, (res) => {
    res.pipe(file);
    // res.on('data', (d) => {
    //     d.pipe(file);
    //     //response.pipe(file);
    // });
});