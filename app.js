//packpub.com 웹크롤링

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 


//var url = "https://ansuchan.com";
var url = "https://www.packtpub.com/all-books?search=&availability_list%5BAvailable%5D=Available&offset=&rows=48&sort=&theme_raw=true";

request(url, function(error, response, body) {  
  if (error) throw error;

   var $ = cheerio.load(body);
   var postElements = $("div.book-block-outer[data-product-id]");
   postElements.each(function() {
console.log($(this).attr("data-product-id"));
//     var postTitle = $(this).find("h1").text();
//     var postUrl = $(this).find("h1 a").attr("href");
//     console.log(postTitle);
   });
});