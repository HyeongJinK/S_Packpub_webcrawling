//packpub.com 웹크롤링 내용 가져오기

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("sync-request");  
var cheerio = require("cheerio"); 
var fs =require('fs');

//var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1/sections/ch01lvl1sec10";
var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781788993173/chapters/1/sections/ch01lvl1sec11";

var data = request("GET", url,
    {
        headers: {
            "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjYyODc0MTIsImV4cCI6MTUyNjI5MTAxMn0.hlSd-QFwdX2qTDBIFluFjiHoCfDaBCEdbZ7J3HytsDOvUMz5D8S_-xhe-EQj3ll6PmXUPTFD2WJfoEshNHzXNxOJ9kM9vvF1VDQm6ZRm9cWItm8TaeYnnUKATQnOpaqbkOkKmtnE0WittsFUXBPyNH9weVFQ6oe6Ft3pl0cEgL6oicvTEtVa5v7WS1IVkM-gX26ZAwE2Ri8LxVWdtE6hPBsfP9V3HF9NqfmuSY_JYmx9NPKF18GfhFU8RinKjZ6DCVpLY8vGIhkvxPx28EKMIxNtm9JJ1abCmeSAaTjjA-VdfvFd4iloDf64Y8l8f8reQSwNB960grKW2L05juiu4g"
        }
    },);  

console.log("adfasdf = " +data.getBody());
var parserData = JSON.parse(data.getBody());

if (parserData.status === 'success') {
    if (parserData.data.entitled) {
        console.log("adsfsdaf"+parserData.data.content);
    }
    //console.log("adsfsdaf"+parserData.data.content);
}
  