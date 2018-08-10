var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var fs =require('fs');

let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");

let gitbookPath = "./gitbook"

let param = [
    "9781786461407"
]

function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, function(err) {
            console.log(err);
        })
    }
}

function createMD(path, fileName, content) {
    fs.writeFile(path+'/'+fileName, content, function(err) {
        if(err) throw err;
        console.log(fileName+' File write completed');
      });
}

db.get("SELECT * FROM book WHERE isbn = ?", param, function(err, rows) {  
    createDir(gitbookPath);

    let defaultPath = gitbookPath +"/"+ replace(rows.title);
    let draftPath = defaultPath +"/_draft"
    createDir(defaultPath);
    createDir(draftPath);
    
    createMD(defaultPath, "README.md", "");
    createMD(defaultPath, "SUMMARY.md", "");
    
    let step = -999;
    db.all("SELECT * FROM content WHERE isbn = ? order by contentIndex", param, function(err, rows) {
        rows.forEach(function(value, index, array) {
            if (step != value.menuNum) {
                step = value.menuNum;
                createDir(draftPath+"/ch"+step);
            }
            
            createMD(draftPath+"/ch"+step, step+"_"+value.contentIndex+".md", "");
        });
    });
});