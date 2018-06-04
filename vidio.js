// //npm install fyda

//const fyda = require('fyda');
// fyda.downloadMp3('https://www.youtube.com/watch?v=KMU0tzLwhbE', '.', 'developers.mp3');
//  fyda.downloadMp4('https://www.youtube.com/watch?v=TFMzvQ0MojE'
//  , '.'
//  , 'test.mp4');

var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("./download/file.mp4");
var request = https.get("https://d1ft11egbn8l.cloudfront.net/From%200%20to%201%20JavaFX%20and%20Swing%20for%20Awesome%20Java%20UIs/Package/videos/video2_3.mp4?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2QxZnQxMWVnYm44bC5jbG91ZGZyb250Lm5ldFwvRnJvbSUyMDAlMjB0byUyMDElMjBKYXZhRlglMjBhbmQlMjBTd2luZyUyMGZvciUyMEF3ZXNvbWUlMjBKYXZhJTIwVUlzXC9QYWNrYWdlXC92aWRlb3NcL3ZpZGVvMl8zLm1wNCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTUyNzYwMzg2MH19fV19&Signature=REhGKptEpGr8tr8uSlAqDjuQjAWW7FlDdyDQc26TOEQIRDvr9zzYO-Vpaf9Rck1CxB6WS51ZeptBTr76XlC40D-mVwG~BvorS9X6j-Z-9afwN8aKKiCvki93P-k62-GwFvGHvbo0xp3lYE2GD9Nvdq6UuFkYicX7pvt84ashBcc_&Key-Pair-Id=APKAJTJLPJQL5PVZ47FA"
, (res) => {
    res.pipe(file);
    // res.on('data', (d) => {
    //     d.pipe(file);
    //     //response.pipe(file);
    // });
});