var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
const request = require("request");
var rp = require('request-promise');
var fs =require('fs');
var cheerio = require("cheerio"); 

const isbn = "9781786461407"
let gitbookPath = "./gitbook2"

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



let formDefault = {
    method: 'POST',
    uri: 'https://openapi.naver.com/v1/papago/n2mt',
    headers: {       
        'content-type': 'application/x-www-form-urlencoded'
        , 'X-Naver-Client-Id': 'PIzcrH8b_OVhgqHKguPr'
        , 'X-Naver-Client-Secret': 'IC57QXbTkQ'
    },
    formData: {
        source: "en"
        , target : "ko"
        , text : ""
    }
};

function parser(h, draftPath, step, contentIndex) {
    let temp = cheerio.load(h);
    let count = temp("h2.title").length + temp("h3.title").length + temp("h4.title").length + temp("p").length + temp("ul").find("li").length + temp("ol").find("li").length;
    let pointent = 0;

    temp("h2.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                console.log(body);
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 

                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("# ");
                pointent += 1;
            })
            .catch(function(e) {
                console.log(e);
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    temp("h3.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 

                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("\n\n## ");
                pointent += 1;
            })
            .catch(function() {
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("h4.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 
                
                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("\n\n### ");
                pointent += 1;
            })
            .catch(function() {
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
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
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 
    
                temp(point).text(trText);  
                temp(point).prepend("\n\n");
                pointent += 1;
            })
            .catch(function() {
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("ul").prepend("\n");
    temp("ol").prepend("\n");

    temp("ul").find("li").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 
    
                temp(point).text(trText);  
                temp(point).prepend("\n* ");
                pointent += 1;
            })
            .catch(function() {
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("ol").find("li").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.text = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.message.result.translatedText 
                
                temp(point).text(trText);  
                if (temp(point).parent().attr("start") == undefined) {
                    temp(point).prepend("\n1. ");
                } else {
                    temp(point).prepend("\n"+temp(point).parent().attr("start")+ ". ");
                } 
                pointent += 1;
            })
            .catch(function() {
                console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    }); 
}

db.get("SELECT * FROM book WHERE isbn = ?", param, function(err, rows) {  
    createDir(gitbookPath);

    let defaultPath = gitbookPath+"/"+FolderReplace(rows.title.replace(/\s/g, "_"))+"_ko";
    let draftPath = defaultPath+"/_draft"
    let summaryContent = "";
    createDir(defaultPath);
    createDir(draftPath);
    
    createMD(defaultPath, "README.md", "");
    
    
    let step = -999; //AND contentIndex in (85)
    db.all("SELECT * FROM content WHERE isbn = ? order by contentIndex", param, function(err, rows) {
        rows.forEach(function(value, index, array) {
            if (step != value.menuNum) {
                step = value.menuNum;
                summaryContent += "\n- ["+ value.title +"](/_draft/ch"+step+"/"+step+"_"+value.contentIndex+".md)"
                createDir(draftPath+"/ch"+step);
            } else {
                summaryContent += "\n   - ["+ value.title +"](/_draft/ch"+step+"/"+step+"_"+value.contentIndex+".md)"
            }
            parser(value.content, draftPath, step, value.contentIndex); 
        });
    });
    
});

db.close();