var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var fs =require('fs');

let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");

let gitbookPath = "./gitbook"

let param = [
    "9781786461407"
]

db.get("SELECT * FROM book WHERE isbn = ?", param, function(err, rows) {    
    if (!fs.existsSync(gitbookPath)) {
        fs.mkdirSync(gitbookPath, function(err) {
            console.log(err);
        })
    }

    let bookPath = gitbookPath +"/"+ replace(rows.title);
    if (!fs.existsSync(bookPath)) {
        fs.mkdirSync(bookPath, function(err) {
            console.log(err);
        })
    }

    db.all("SELECT * FROM content WHERE isbn = ? order by contentIndex", param, function(err, rows) {
        console.log(rows);
    });
});