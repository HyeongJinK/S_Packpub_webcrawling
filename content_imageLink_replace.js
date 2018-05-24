/**
 * db 안에 있는 이미지 링크 주소 변경 
 */
var fs =require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
const len = 1000;

//img src="/graphics/
//https://www.packtpub.com/
let replace = (s) => s.replace(/img src=\"\/graphics/g, "img src=\"https://www.packtpub.com/graphics");
function image_replace() {
    let p = 0;
    //while (true) {
        db.all("select * from content where content like '%img src=\"/graphics/%' limit "+p+", "+len, function(err, rows) {
            if (rows.length == 0) {
                return;
            }
            //p = p + 100;
            rows.forEach(function (row) {
                let content = replace(row.content);
                let isbn = row.isbn;
                let contentIndex = row.contentIndex
                db.serialize(function() {
                    let stmt = db.prepare("UPDATE content SET content = ? WHERE isbn = ? and contentIndex = ?");
                    
                    stmt.run(content, isbn, contentIndex); 
                    p++;               
                    console.log(p/rows.length*100+"%")
                    stmt.finalize();
                }); 
            })
        });	
    //}
}
image_replace()
//db.close();