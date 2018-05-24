var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var cheerio = require("cheerio"); 


function wiki_replace() {
    db.all("select * from content where isbn = '9781788475891' and contentIndex = 43", function(err, rows) {
        console.log(rows)
        rows.forEach(function (row) {
            let wiki_content = "";
            let $ = cheerio.load(row.content);

            wiki_content = `h1. `+$("h2.title").text()
            console.log(wiki_content);
        //     let content = replace(row.content);
        //     let isbn = row.isbn;
        //     let contentIndex = row.contentIndex
        //     db.serialize(function() {
        //         let stmt = db.prepare("UPDATE content SET content = ? WHERE isbn = ? and contentIndex = ?");
                
        //         stmt.run(content, isbn, contentIndex); 
        //         p++;               
        //         console.log(p/rows.length*100+"%")
        //         stmt.finalize();
        //     }); 
        })
    });	
}
wiki_replace()