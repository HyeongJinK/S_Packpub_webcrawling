//packpub.com 웹크롤링

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio");  
//var url = "https://ansuchan.com";
var url = "https://www.packtpub.com/mapt-rest/products/9781786462558/metadata";

request(url, function(error, response, body) {  
  if (error) throw error;

	//console.log(body);
    var metadata = JSON.parse(body);
    var menudata = metadata.data.tableOfContents;
    
    console.log(menudata[0].children[0]);
    //console.log(metadata.data.tableOfContents[0]);




//   var $ = cheerio.load(body);
//   var postElements = $("section.posts article.post");
//   postElements.each(function() {
//     var postTitle = $(this).find("h1").text();
//     var postUrl = $(this).find("h1 a").attr("href");
//     console.log(postTitle);
//   });
});