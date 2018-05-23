var sqlite3 = require('sqlite3').verbose();
var request = require("sync-request"); 
var db = new sqlite3.Database('./DB/books.db');
let p = 0;
const count = 408;

db.all("SELECT isbn FROM book where imgUrl = ''", function(err, rows) {
    rows.forEach(function (row) {
        let isbn = row.isbn;
        //console.log(isbn);
        let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
        //console.log(menuUrl);
        let menuData = request("GET", menuUrl)
        let menuParserData = JSON.parse(menuData.getBody());
        let imgUrl = menuParserData.data.imageUrl;
        //console.log(imgUrl);
        db.serialize(function() {
            let stmt = db.prepare("UPDATE  book SET imgUrl = ? WHERE isbn = ?");
            
            stmt.run(imgUrl, isbn);
            p++;
            console.log(p*100/count+"%")
            stmt.finalize();
        }); 
    })
});	
//db.close();