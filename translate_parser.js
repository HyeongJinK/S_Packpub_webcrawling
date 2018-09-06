var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var cheerio = require("cheerio"); 

const isbn = "9781786468734"
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&amp;/g, '&').replace(/&#x2013;/g, '-').replace(/&#xA0;/g, ' ').replace(/&#x/g, '%u').replace(/;/g, '');

db.get('SELECT * FROM content WHERE isbn = ? and contentIndex = 60'
    , [isbn]
    ,(err, rows) =>
    {
        const h = cheerio.load(rows.content);
        let temp = h;

        temp("h2.title").prepend("# ");
        temp("h3.title").prepend("\n\n## ");
        temp("h4.title").prepend("\n\n### ");
        temp("h5.title").prepend("\n\n#### ");

        temp("pre.programlisting").prepend("\n\n```java\n").append("\n```");
        
        temp("strong").prepend("**").append("**");
        temp("img").each(function(i, elem) {
            temp(this).parent().prepend("\n\n![](" + temp(this).attr("src") + ")");
        });
        temp("code.literal").each(function(i, elem) {
            //temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
            temp(this).prepend("\`").append("\`");
        });
        temp("div.note p").prepend("> ")

        temp("p").each(function(i, elem) {
            temp(this).prepend("\n\n");
        });

        
        
        
        temp("ul").prepend("\n");
        temp("ol").prepend("\n");

        temp("ul").find("li").each(function(i, elem) {
            temp(this).prepend("\n* ");
        });
        
        temp("ol").find("li").each(function(i, elem) {
            if (temp(this).parent().attr("start") == undefined) {
                temp(this).prepend("\n1. ");
            } else {
                temp(this).prepend("\n"+temp(this).parent().attr("start")+ ". ");
            } 
        });

        temp("td").each(function(i, elem) {
            temp(this).text(temp(this).text().replace(/^\n/g, "").replace(/^\n/g, ""));
        });
        
        temp("table").each(function(i, elem) {
            temp(this).prepend("\n");
            temp(this).find("tr").each(function(j, elem) {
                let tdCount = temp(this).find("td").length;
                temp(this).prepend("\n|");

                if (j == 0) {
                    temp(this).append("\n|")
                    for (var z = 0; tdCount > z; z++) {
                        temp(this).append("-|")
                    }
                }
            });
            temp(this).find("td").append("|")
        });
        console.log(temp.text());
        //console.log(temp.html());
        //console.log(replace(htmlReplace(temp.html())));
    }
);

db.close();