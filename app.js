//packpub.com 웹크롤링

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
                "Authorization" : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjMzNDU0MDksImV4cCI6MTUyMzM0OTAwOX0.YqKkSI6JzdFSZzDG4WiwUz0mOzBftvpE7a5V43BwYUNQ9BKlhP0qMFz9-wBdrATmaBXmn2rcBN3lkwqqQHrbDsMb6UI9mP3IfZLIbl9BW_4XFzbumnbuGnmPlkFtMiJ_R18RY_FGmYXTaqARjbljNRAmpkdv0eTgHiM0XcuEMqdfON1FkT-Iuacta4gtx8JVTDJQ2woGQoc1JSe5T70_IxOGUEyLXpycFHQSbmOPXe4ctqVy78ooJG12dFpSO77meNp0Tf_pTIY3ByTZrNQHfe02I31YDsytQsblmOzwayg6fHjgiSRkV7jcnBDmkgc4sJUwkA_h7eSWHxIfOI2z3g"
          }
        }
        //console.log(options)
        request(options, function(cerror, cresponse, cbody) {  
          //if (cerror) throw cerror;

          //console.log(cbody);
          var cParserData = JSON.parse(cbody);
      
          if (cParserData.status === 'success') {
              if (cParserData.data.entitled) {
                //TODO html 파싱
                let doc = new PDFDocument();  //TODO 파일 순서에 맞게 이름 조정 필요
                doc.pipe(fs.createWriteStream(bookPath+"/"+parentID+"_"+element.title));
                doc.text(cParserData.data.content);
                doc.end();
                  //console.log(cParserData.data.content);
              }
          }
        });
        
      })
    });    
  }
});