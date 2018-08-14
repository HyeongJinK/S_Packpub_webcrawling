var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
const request = require("sync-request");
var fs =require('fs');
var cheerio = require("cheerio"); 

const isbn = "9781787285736"
let gitbookPath = "./gitbook"

let FolderReplace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&').replace(/&#x/g, '%u').replace(/;/g, '');

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
    fs.writeFileSync(path+'/'+fileName, content)
    console.log(fileName+' File write completed');
}

function translateApiCall(oriStr) {
    let formData = "key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q="+oriStr
            
    let res = request("post", 'https://www.googleapis.com/language/translate/v2', {
        headers: {       
                'content-type': 'application/x-www-form-urlencoded'
            },
        body: formData
        }
    );
    let trStr = JSON.parse(res.getBody());
    let trText = trStr.data.translations[0].translatedText 

    return trText;
}

function parser(h) {
    let temp = cheerio.load(h);

    temp("h2.title").each(function(i, elem) {
        temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
        temp(this).prepend("# ");
    });
    temp("h3.title").each(function(i, elem) {
        temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
        temp(this).prepend("\n\n## ");
    });
    temp("h4.title").each(function(i, elem) {
        temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
        temp(this).prepend("\n\n### ");
    });
    
    temp("pre.programlisting").prepend("\n\n```java\n").append("\n```");
    temp("strong").prepend("**").append("**");
    temp("img").each(function(i, elem) {
        temp(this).parent().prepend("\n\n![](" + temp(this).attr("src") + ")").append("\n");
    });
    temp("code.literal").each(function(i, elem) {
        temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
        //temp(this).prepend("[[").append("]]");
    });
    
    temp("p").each(function(i, elem) {
        temp(this).text(translateApiCall(temp(this).text()));  
        temp(this).prepend("\n\n");
    });
    
    temp("ul").prepend("\n");
    temp("ol").prepend("\n");

    temp("ul").find("li").each(function(i, elem) {
        temp(this).text(translateApiCall(temp(this).text()));
        temp(this).prepend("\n* ");
    });
    
    temp("ol").find("li").each(function(i, elem) {
        temp(this).text(translateApiCall(temp(this).text()));  
        if (temp(this).parent().attr("start") == undefined) {
            temp(this).prepend("\n1. ");
        } else {
            temp(this).prepend("\n"+temp(this).parent().attr("start")+ ". ");
        } 
    });

    return unescape(replace(htmlReplace(temp.html())));
}

db.get("SELECT * FROM book WHERE isbn = ?", param, function(err, rows) {  
    createDir(gitbookPath);

    let defaultPath = gitbookPath+"/"+FolderReplace(rows.title.replace(/\s/g, "_"))+"_ko";
    let draftPath = defaultPath+"/_draft"
    let summaryContent = "";
    createDir(defaultPath);
    createDir(draftPath);
    
    createMD(defaultPath, "README.md", "");
    
    
    let step = -999;
    db.all("SELECT * FROM content WHERE isbn = ? and menuNum in (1,2) order by contentIndex", param, function(err, rows) {
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
        //createMD(defaultPath, "SUMMARY.md", summaryContent);
    });
    
});

db.close();