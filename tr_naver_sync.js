var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
const request = require("sync-request");
var fs =require('fs');
var cheerio = require("cheerio"); 

const isbn = "9781786461407"
let contentIndexStr= "16,17,18,19,20";
let currentNaver = 0;

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

let naverId = ['PIzcrH8b_OVhgqHKguPr','c39XRmuZCJ3A1fANGlcf','3eJTPsF5z0Pd0M_nq5P8', 'pxbwvspJZrne2m7B4sdM','OXxix1TtpCJiToTABQT9','VcwBQ20yokWNxNXr28_P','XpfDMtSUjHpFaov4WPZm','V7rQE4ImkaHPCWwJL_G_','U9QnRU7H0Yc7JOvdHmHo','PQK6yFEsXt5xENhZN3Sv'];
let naverSecret = ['IC57QXbTkQ', 'KkBf_8n9nP', 'pePl0dDFLK', 'LlEHqsIH8P','_oA5h0Wsg4', '7pxQoakogu', '7063e9k4FZ', 'inliX0U89t', '8ZYQZxPyMY', 'lUIJJN9WS5'];
function translateApiCall(oriStr = "") {
    try {
        let formData = "source=en&target=ko&text="+oriStr
            
        var res = request("post", 'https://openapi.naver.com/v1/papago/n2mt', {
            headers: {       
                    'content-type': 'application/x-www-form-urlencoded'
                    , 'X-Naver-Client-Id': naverId[currentNaver]
                    , 'X-Naver-Client-Secret': naverSecret[currentNaver]
                },
            body: formData
            }
        );

        var trStr = JSON.parse(res.getBody('utf8'));
        let trText = trStr.message.result.translatedText 

        return trText;
    } catch (e) {
        ++currentNaver;
        if (currentNaver >= naverId.length) {
            console.log(e);
        } else {
            return translateApiCall(oriStr);
        }
    }
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
        temp(this).prepend("\'").append("\'");
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

    let defaultPath = gitbookPath+"/"+FolderReplace(rows.title.replace(/\s/g, "_"))+"_n";
    let draftPath = defaultPath+"/_draft"
    let summaryContent = "";
    createDir(defaultPath);
    createDir(draftPath);
    
    createMD(defaultPath, "README.md", "");
    
    //menuNum
    let step = -999;
    db.all("SELECT * FROM content WHERE isbn = ? and contentIndex in ("+contentIndexStr+") order by contentIndex", param, function(err, rows) {
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