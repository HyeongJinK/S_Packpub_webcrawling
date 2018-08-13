const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/books.db');
const cheerio = require("cheerio"); 
const request = require("sync-request");

const isbn = "9781786461407"

let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&').replace(/&#x/g, '%u').replace(/;/g, '');

function translateApiCall(oriStr) {
    let formData = "key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q="+oriStr
            
    var res = request("post", 'https://www.googleapis.com/language/translate/v2', {
        headers: {       
                'content-type': 'application/x-www-form-urlencoded'
            },
        body: formData
        }
    );
    var trStr = JSON.parse(res.getBody());
    let trText = trStr.data.translations[0].translatedText 

    return trText;
}

db.get('SELECT * FROM content WHERE isbn = ? and contentIndex = 4'
    , [isbn]
    ,(err, rows) =>
    {
        let h = cheerio.load(rows.content);
        let temp = h;
        
        let sr = temp("img").attr("src");

        temp("h2.title").each(function(i, elem) {
            temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
            temp(this).prepend("# ").append("\n");
        });
        temp("h3.title").each(function(i, elem) {
            temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
            temp(this).prepend("\n## ").append("\n");
        });
        temp("h4.title").each(function(i, elem) {
            temp(this).text(temp(this).text() + " - " + translateApiCall(temp(this).text()));  
            temp(this).prepend("\n### ").append("\n");
        });
        
        temp("pre.programlisting").prepend("\n\n```java\n").append("\n```\n");
        temp("strong").prepend("**").append("**");
        temp("img").each(function(i, elem) {
            temp(this).parent().prepend("\n![](" + temp(this).attr("src") + ")").append("\n");
        });
        temp("code.literal").each(function(i, elem) {
            //temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
            temp(this).prepend("[[").append("]]");
        });
        
        temp("p").each(function(i, elem) {
            temp(this).text(translateApiCall(temp(this).text()));  
            temp(this).prepend("\n").append("\n");
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

        //console.log(temp.html());
        console.log(unescape(replace(htmlReplace(temp.html()))));
    }
);

db.close();