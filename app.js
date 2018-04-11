//packpub.com 웹크롤링
//TODO isbn 목록 가져오기 적용.. 파싱 적용
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
var PDFDocument = require('pdfkit');
var fs =require('fs');
var downloadDataPath = "./download/"

var isbn = 9781786462558
var menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
//https://www.packtpub.com/mapt-rest/users/me/products/9781786462558/chapters/1/sections/ch01lvl1sec10
request(menuUrl, function(error, response, body) {  
  if (error) throw error;

  var mParserData = JSON.parse(body);
  var bookPath = downloadDataPath + mParserData.data.title+"_"+isbn;
  if (mParserData.status === 'success' && mParserData.data.earlyAccess == false) {
    if (!fs.existsSync(bookPath)) {
      fs.mkdirSync(bookPath, function(err) {
        console.log(err);
      })
    }
    // console.log(mParserData.data.imageUrl) // 이미지
    mParserData.data.tableOfContents.forEach(element => {
      var parentID = element.id
      var baseContentUrl = "https://www.packtpub.com/mapt-rest/users/me/products/"+isbn+"/chapters/"+parentID;
      var ch_index = 0;
      element.children.forEach(element => {
        var contentUrl;
        if (parentID != element.id) {
          contentUrl = baseContentUrl + "/sections/"+element.id
        } else {
          contentUrl = baseContentUrl;
        }
        //console.log("url = " +contentUrl)
        //console.log("children = " +element.id)
        //console.log("children = " +element.title)
        var options = {
            url : contentUrl
            , headers: {//TODO 키 확인
                "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjM0MjU0OTAsImV4cCI6MTUyMzQyOTA5MH0.dFONCD2rlRSPQG0qy2rhCM-mhYcwBSRl3wB-_RAwhAA8Z6gfRUYCHn4t9dwHEgN5BveI4SvBO09PtD_J7eLrz3oup1-8s7Hj6RYz2jE_dYcefE_xKrxw7nbmX_JJBYM1gbsmPDQHlYEBS7VK__5CnX6avA0qZWIA0voWcHdfvijHC5Wt_cYhWDtlk52_Nx9ccgHvQ-AW3Aq-wgMtxHk8e9bpvgxpwSZlRiZ0V4R5iYzUpYU-Ubv2nX1c4GRqN3jbQy9-PImwSo03fWpgTiDmJ-aHQVplXT-npGPoA45Ny2fnJs66-xbV7YXzTipsjm490u06enbypMtYo-IkMieu3A"
          }
        }
        //console.log(options)
        request(options, function(cerror, cresponse, cbody) {  
          //if (cerror) throw cerror;

          //console.log(cbody);
          var cParserData = JSON.parse(cbody);
      
          if (cParserData.status === 'success') {
              if (cParserData.data.entitled) {
                ch_index++;
                fs.writeFileSync(bookPath+"/"+parentID+"_"+ch_index+"_"+element.title, cParserData.data.content);
                //TODO html 파싱
                // let doc = new PDFDocument();  //TODO 파일 순서에 맞게 이름 조정 필요
                // doc.pipe(fs.createWriteStream(bookPath+"/"+parentID+"_"+element.title));
                // doc.text(cParserData.data.content);
                // doc.end();
                  //console.log(cParserData.data.content);
              }
          }
        });
        
      })
    });    
  }
});