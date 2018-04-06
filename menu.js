//packpub.com 웹크롤링

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 

var url = "https://www.packtpub.com/mapt-rest/products/9781786462558/metadata";

request(url, function(error, response, body) {  
  if (error) throw error;

  var parserData = JSON.parse(body);

  //console.log(parserData)

  console.log(parserData.status)
  console.log(parserData.data.earlyAccess)
  console.log(parserData.data.title)
  console.log(parserData.data.tableOfContents.length)
  console.log(parserData.data.tableOfContents[0].title)
  console.log(parserData.data.tableOfContents[0].id)
  console.log(parserData.data.tableOfContents[0].children.length)
  console.log(parserData.data.tableOfContents[0].children[1].id)
  
  //console.log(body)
});