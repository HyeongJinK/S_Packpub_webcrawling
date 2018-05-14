//packpub.com 웹크롤링

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
var fs =require('fs');

var url = "https://www.packtpub.com/mapt-rest/products/9781786462558/metadata";


var downloadDataPath = "d:/download/"
request(url, function(error, response, body) {  
  if (error) throw error;

  var parserData = JSON.parse(body);
  console.log(parserData);
  // if (parserData.status === 'success' && parserData.data.earlyAccess == false) {
   
  //   if (!fs.existsSync(downloadDataPath + parserData.data.title)) {
  //     //console.log(downloadDataPath + parserData.data.title)
  //     fs.mkdir(downloadDataPath + parserData.data.title, function(err) {
        
  //     })
  //   }    
  // }
  

  // console.log(parserData.status)   // staus == 'success'
  // console.log(parserData.data.earlyAccess) // false
  // console.log(parserData.data.title) // title
  // console.log(parserData.data.imageUrl) // 이미지
  // console.log(parserData.data.tableOfContents.length) // 테이블 크기
  // console.log(parserData.data.tableOfContents)
  
  // console.log(parserData.data.tableOfContents[0].title)
  // console.log(parserData.data.tableOfContents[0].id)
  // console.log(parserData.data.tableOfContents[0].children.length)
  // console.log(parserData.data.tableOfContents[0].children[1])
  // console.log(parserData.data.tableOfContents[0].children[1].title)
  // console.log(parserData.data.tableOfContents[0].children[1].id)



  // console.log(parserData)
  
  //console.log(body)
});