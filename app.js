//packpub.com 웹크롤링

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
var jsdom = require('jsdom');
var $ = require("jQuery");

jsdom.env({
  url: 'http://news.ycombinator.com',
  src: [],
  done: function (err, window) {
    var $ = jquery(window);
    $('td.title:not(:last) a').each(function () {
      console.log(' -', $(this).text());
    });
  }
});

//var url = "https://ansuchan.com";
var url = "https://www.packtpub.com/all-books?search=&availability_list%5BAvailable%5D=Available&offset=&rows=48&sort=&theme_raw=true";

request(url, function(error, response, body) {  
  if (error) throw error;

  //console.log(body);
  //console.log($(body))
  //  $("div.book-block-outer [data-product-id]")
   // var metadata = JSON.parse(body);
  //  var menudata = metadata.data.tableOfContents;

  //  console.log(menudata[0].children[0]);
    //console.log(metadata.data.tableOfContents[0]);



//
//   var $ = cheerio.load(body);
//   var postElements = $("section.posts article.post");
//   postElements.each(function() {
//     var postTitle = $(this).find("h1").text();
//     var postUrl = $(this).find("h1 a").attr("href");
//     console.log(postTitle);
//   });
});