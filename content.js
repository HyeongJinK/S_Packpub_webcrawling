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
        "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjM0MjU0OTAsImV4cCI6MTUyMzQyOTA5MH0.dFONCD2rlRSPQG0qy2rhCM-mhYcwBSRl3wB-_RAwhAA8Z6gfRUYCHn4t9dwHEgN5BveI4SvBO09PtD_J7eLrz3oup1-8s7Hj6RYz2jE_dYcefE_xKrxw7nbmX_JJBYM1gbsmPDQHlYEBS7VK__5CnX6avA0qZWIA0voWcHdfvijHC5Wt_cYhWDtlk52_Nx9ccgHvQ-AW3Aq-wgMtxHk8e9bpvgxpwSZlRiZ0V4R5iYzUpYU-Ubv2nX1c4GRqN3jbQy9-PImwSo03fWpgTiDmJ-aHQVplXT-npGPoA45Ny2fnJs66-xbV7YXzTipsjm490u06enbypMtYo-IkMieu3A"
    }
}

request(options, function(error, response, body) {  
    if (error) throw error;
    console.log("adfasdf = " +body);
    var parserData = JSON.parse(body);
    
    if (parserData.status === 'success') {
        if (parserData.data.entitled) {
            console.log(parserData.data.content);
        }
    }
  });