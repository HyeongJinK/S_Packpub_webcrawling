//packpub.com 웹크롤링 내용 가져오기

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
var fs =require('fs');

//var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1/sections/ch01lvl1sec10";
var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1";

var options = {
    url : "https://www.packtpub.com/mapt-rest/users/me/products/9781788993173/chapters/1/sections/ch01lvl1sec11"
    , headers: {
        "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjYyODIxMTYsImV4cCI6MTUyNjI4NTcxNn0.CwShozr1AKBMQnvGZ-K2yfoCneUxie5ArOGuHbvfT2k7V5OmhD-jG9hNegWy5ZH8dNlJ-9-e-ws8ILI2xsSgYErimxHTtZrMdvtk9BEQSoij1atWJ7xqYiP1XkKHu3NwQ7rewymc9ZbZfC5qBPJpA3DLgUfSAO1y8mjGK-GxaUr4FVzl49w3pKpPIvVVXSZA6g9bienxtY_g3fl2Btj7rBf_QurlxTHVbOpO2pqMB03fPp8RIuxRrF7FL4o9dmNKcB5mPheZVWefVr7be4D3_s9CVkVqYPzc2eIh4luZvBHpKpGoe83UcYYOX6gjIl_xyqQgoav1_UFSdmg30TanJg"
    }
}

request(options, function(error, response, body) {  
    if (error) throw error;
    console.log("adfasdf = " +body);
    var parserData = JSON.parse(body);
    
    if (parserData.status === 'success') {
        if (parserData.data.entitled) {
            console.log("adsfsdaf"+parserData.data.content);
        }
        //console.log("adsfsdaf"+parserData.data.content);
    }
  });