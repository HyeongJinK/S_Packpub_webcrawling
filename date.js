var sqlite3 = require('sqlite3').verbose();
var request = require("sync-request"); 
var db = new sqlite3.Database('./DB/books.db');
let p = 0;

db.all('SELECT isbn, (SELECT count(isbn) FROM book where publicationDate = "") as cc FROM book where publicationDate = ""', function(err, rows) {
    rows.forEach(function (row) {
        let isbn = row.isbn;
        let count = row.cc;
        //console.log(isbn);
        let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/header-metadata";
        //console.log(menuUrl);
        let menuData = request("GET", menuUrl)
        let menuParserData = JSON.parse(menuData.getBody());
        let publicationDate = menuParserData.data.publicationDate;
        let category = menuParserData.data.category;
        let description = menuParserData.data.description;
        //console.log(imgUrl);
        db.serialize(function() {
            let stmt = db.prepare("UPDATE  book SET publicationDate = ?, category = ?, description = ? WHERE isbn = ?");
            
            stmt.run(publicationDate, category, description, isbn);
            p++;
            console.log(p*100/count+"%")
            stmt.finalize();
        }); 
    })
});	
//db.close();