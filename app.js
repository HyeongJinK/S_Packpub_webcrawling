//packpub.com 웹크롤링
//TODO isbn 목록 가져오기 적용.. 파싱 적용
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("request");  
var cheerio = require("cheerio"); 
//var PDFDocument = require('pdfkit');
var fs =require('fs');
var downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjYyNzgxNTYsImV4cCI6MTUyNjI4MTc1Nn0.afYAtTUZ0VTya9ddQuuYsD1UcmJXp4PRunfNs-jhoJ1q8bs2FFaIA1Ud1B_8AauARe7QrCTHiI_LeCUin4KnPgr_wJ_N8UcouUIcHanFszFaUPEfSTJmKtu9pcoXjNeh2J4CZxpeNX-tKuWeMAPdPAv-Bu71b2tUJlMysykjnJSNKZTvZtO7TY0glTbur_0VpZh0X4wpjITqxjhPNpIBeYhZlyj4S6ehnGr8PHIzbIOVaraapFkG7v1LAsKEdrFgKq4qh1_HHOLEw02z28eB9nz-fPVABMQK8C4tR2xr6pvercaufax3EmE86PKQ4zE-RnHKbBRi8yGwQgi5gCKOYg";
var isbn = 9781788993173
var menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
//https://www.packtpub.com/mapt-rest/users/me/products/9781788993173/chapters/1/sections/ch01lvl1sec11
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
          contentUrl = baseContentUrl + "/sections/" + element.id
        } else {
          contentUrl = baseContentUrl;
        }
        var options = {
            url : contentUrl
            , headers: {//TODO 키 확인
                "Authorization" : user
          }
        }
        request(options, function(cerror, cresponse, cbody) {  
          if (cbody != "") {
            var cParserData = JSON.parse(cbody);
      
            if (cParserData.status === 'success') {
                if (cParserData.data.entitled) {
                  fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+element.title+".txt", cParserData.data.content);
                }
            }
          } else {
            console.log("error :" +parentID+"_"+element.index+"_"+element.title)
          }
        });
        
      })
    });    
  }
});