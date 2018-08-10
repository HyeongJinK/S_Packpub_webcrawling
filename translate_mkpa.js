var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var fs =require('fs');
var cheerio = require("cheerio"); 

const isbn = "9781786461407"
let gitbookPath = "./gitbook"

let FolderReplace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&');

let param = [
    isbn
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

function parser(h) {
    let temp = cheerio.load(h);
        
    let sr = temp("img").attr("src");

    temp("h2.title").prepend("# ").append("\n");
    temp("h3.title").prepend("\n## ").append("\n");
    temp("h4.title").prepend("\n### ").append("\n");
    
    temp("p").prepend("\n").append("\n");
    temp("strong").prepend("**").append("**");
    temp("img").each(function(i, elem) {
        temp(this).parent().prepend("\n![](" + temp(this).attr("src") + ")").append("\n");
    });
    temp("code.literal").each(function(i, elem) {
        temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
        //temp(this).prepend("[[").append("]]");
    });
    
    temp("pre.programlisting").prepend("\n\n```java\n").append("\n```\n");
    

    temp("ul").prepend("\n");
    temp("ol").prepend("\n");
    temp("ul").find("li").prepend("\n* ");
    temp("ol").find("li").each(function(i, elem) {
        temp(this).prepend("\n"+temp(this).parent().attr("start")+". ");
    }); 

    //console.log(temp.html());

    return replace(htmlReplace(temp.html()));
}

db.get("SELECT * FROM book WHERE isbn = ?", param, function(err, rows) {  
    createDir(gitbookPath);

    let defaultPath = gitbookPath+"/"+FolderReplace(rows.title);
    let draftPath = defaultPath+"/_draft"
    let summaryContent = "";
    createDir(defaultPath);
    createDir(draftPath);
    
    createMD(defaultPath, "README.md", "");
    
    
    let step = -999;
    db.all("SELECT * FROM content WHERE isbn = ? order by contentIndex", param, function(err, rows) {
        rows.forEach(function(value, index, array) {
            if (step != value.menuNum) {
                step = value.menuNum;
                summaryContent += "\n- ["+ value.title +"](/_draft/ch"+step+"/"+step+"_"+value.contentIndex+".md)"
                createDir(draftPath+"/ch"+step);
            } else {
                summaryContent += "\n   - ["+ value.title +"](/_draft/ch"+step+"/"+step+"_"+value.contentIndex+".md)"
            }
            
            createMD(draftPath+"/ch"+step, step+"_"+value.contentIndex+".md", parser(value.content));
        });
        createMD(defaultPath, "SUMMARY.md", summaryContent);
    });
    
});

db.close();