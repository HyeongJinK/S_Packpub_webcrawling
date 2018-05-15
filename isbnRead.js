/*
isbn 문서에서 정보를 가져와서 isbn 하나씩 출력
*/
var fs =require('fs');

fs.readFile("isbn.txt", 'utf8', function(err, data) {
    //console.log(data);
    var isbns = data.split("\t")

    for (isbn in isbns) {
        console.log(isbns[isbn]);
    }
});