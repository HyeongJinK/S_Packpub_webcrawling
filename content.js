//packpub.com 웹크롤링 내용 가져오기

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
var fs =require('fs');

//var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1/sections/ch01lvl1sec10";
var url = "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1";

var options = {
    url : "https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1/sections/ch01lvl1sec10"
    , headers: {
        "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjMzNDU0MDksImV4cCI6MTUyMzM0OTAwOX0.YqKkSI6JzdFSZzDG4WiwUz0mOzBftvpE7a5V43BwYUNQ9BKlhP0qMFz9-wBdrATmaBXmn2rcBN3lkwqqQHrbDsMb6UI9mP3IfZLIbl9BW_4XFzbumnbuGnmPlkFtMiJ_R18RY_FGmYXTaqARjbljNRAmpkdv0eTgHiM0XcuEMqdfON1FkT-Iuacta4gtx8JVTDJQ2woGQoc1JSe5T70_IxOGUEyLXpycFHQSbmOPXe4ctqVy78ooJG12dFpSO77meNp0Tf_pTIY3ByTZrNQHfe02I31YDsytQsblmOzwayg6fHjgiSRkV7jcnBDmkgc4sJUwkA_h7eSWHxIfOI2z3g"
    }
}

request(options, function(error, response, body) {  
    if (error) throw error;
    //console.log("adfasdf = " +body);
    var parserData = JSON.parse(body);
    
    if (parserData.status === 'success') {
        if (parserData.data.entitled) {
            console.log(parserData.data.content);
        }
    }
  });