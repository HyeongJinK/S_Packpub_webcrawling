var fs =require('fs');

fs.readFile("isbn.txt", 'utf8', function(err, data) {
    //console.log(data);
    var isbns = data.split("\t")

    for (isbn in isbns) {
        console.log(isbns[isbn]);
    }
});