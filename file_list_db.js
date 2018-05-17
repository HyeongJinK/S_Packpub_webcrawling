//파일 목록 가져오기

var fs =require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

let replace2 = (s) => s.replace(/\@/g, "?").replace(/\[/g, "<").replace(/\]/g, ">").replace(/\-/g, ":").replace(/\+/g, "*").replace(/\\/g, " ").replace(/\&/g, "/").replace("\n", "");

function insertData(isbn, menuNum, index, title, content) {
    db.serialize(function() {
        let stmt = db.prepare("INSERT INTO content VALUES (?,?,?,?,?)");
        
        stmt.run(isbn, menuNum, index, title, content);
        
        stmt.finalize();
    });  
}


function getFiles (dir, files_){
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        let isbn = files[i].substr(files[i].lastIndexOf("_")+1, 13);
        let booktitle = replace2(files[i].substr(0, files[i].lastIndexOf("_")));
        db.serialize(function() {
            let stmt = db.prepare("INSERT INTO book VALUES (?,?,?,?,?,?)");
            
            stmt.run(isbn, booktitle, "", "", "", "");
            
            stmt.finalize();
        }); 
        
        if (fs.statSync(name).isDirectory()){
            let subfiles = fs.readdirSync(name);
            for (var j in subfiles){
                let chNum = subfiles[j].substring(0, subfiles[j].indexOf("_"));
                let temp = subfiles[j].substr(subfiles[j].indexOf("_")+1, subfiles[j].length)
                let inNum = temp.substring(0, temp.indexOf("_"));
                let title = replace2(temp.substring(temp.indexOf("_")+1, temp.lastIndexOf(".")));
                let content = fs.readFileSync(name+"/"+subfiles[j], 'utf8')
                
                insertData(isbn, chNum, inNum, title, content);                           
            }
        }
        
    }
    return files_;
}
getFiles('./down2')
