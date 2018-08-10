var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var cheerio = require("cheerio"); 

const isbn = "9781786461407"
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&');

db.get('SELECT * FROM content WHERE isbn = ? and contentIndex = 36'
    , [isbn]
    ,(err, rows) =>
    {
        const h = cheerio.load(rows.content);
        let temp = h;
        
        
        let sr = temp("img").attr("src");

        temp("h2.title").prepend("# ").append("\n");
        temp("h3.title").prepend("\n## ").append("\n");
        
        temp("p").prepend("\n").append("\n");
        temp("img").each(function(i, elem) {
            temp(this).parent().prepend("\n![](" + temp(this).attr("src") + ")").append("\n");
        });
        temp("code.literal").each(function(i, elem) {
            //temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
            temp(this).prepend("[[").append("]]");
        });
        
        temp("pre.programlisting").prepend("\n\n```java\n").append("\n```\n");
        

        temp("ul").prepend("\n").append("\n");;
        temp("li").prepend("\n* ");

        //console.log(temp.html());

        
        console.log(replace(htmlReplace(temp.html())));
        
        //console.log(rows.content);

    }
);

db.close();