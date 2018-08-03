//파일 목록 가져오기

var fs =require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
let input = 0;
let noinput= 0;

let replace2 = (s) => s.replace(/\@/g, "?").replace(/\[/g, "<").replace(/\]/g, ">").replace(/\-/g, ":").replace(/\+/g, "*").replace(/\\/g, " ").replace(/\&/g, "/").replace("\n", "");

function getFiles (dir, files_){
    var files = fs.readdirSync(dir);
    for (var i in files){
        let name = dir + '/' + files[i];
        
        let isbn = files[i].substr(files[i].lastIndexOf("_")+1, 13);
        let booktitle = replace2(files[i].substr(0, files[i].lastIndexOf("_")));
        db.get('SELECT * FROM book WHERE isbn = ?'
                , [isbn]
                ,(err, rows) =>
                {
                    if(rows && err === null)
                    {
                        console.log("있음 = "+rows.isbn);
                        noinput++;
                    }
                    else
                    {
                        db.serialize(function() {
            
                            let stmt = db.prepare("INSERT INTO book VALUES (?,?,?,?,?,?, ?)");
                            
                            stmt.run(isbn, booktitle, "", "", "", "", "");
                            input++;
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
                                //console.log(name+"/"+subfiles[j]);
                                db.serialize(function() {
                                    let stmt = db.prepare("INSERT INTO content VALUES (?,?,?,?,?)");
                                    
                                    stmt.run(isbn, chNum, inNum, title, content);
                                    
                                    stmt.finalize();
                                    
                                });                           
                            }
                        }
                    }
                    console.log("input = " +input+ "  noinput = " + noinput);
                }
            )   
    }
}

getFiles('./download03')

