//packpub.com 웹크롤링
//TODO isbn 목록 가져오기 적용.. 파싱 적용
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("sync-request");  
var cheerio = require("cheerio"); 
//var PDFDocument = require('pdfkit');
var fs =require('fs');
var downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjYyODc0MTIsImV4cCI6MTUyNjI5MTAxMn0.hlSd-QFwdX2qTDBIFluFjiHoCfDaBCEdbZ7J3HytsDOvUMz5D8S_-xhe-EQj3ll6PmXUPTFD2WJfoEshNHzXNxOJ9kM9vvF1VDQm6ZRm9cWItm8TaeYnnUKATQnOpaqbkOkKmtnE0WittsFUXBPyNH9weVFQ6oe6Ft3pl0cEgL6oicvTEtVa5v7WS1IVkM-gX26ZAwE2Ri8LxVWdtE6hPBsfP9V3HF9NqfmuSY_JYmx9NPKF18GfhFU8RinKjZ6DCVpLY8vGIhkvxPx28EKMIxNtm9JJ1abCmeSAaTjjA-VdfvFd4iloDf64Y8l8f8reQSwNB960grKW2L05juiu4g";
var isbn = 9781788993173
var menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
//https://www.packtpub.com/mapt-rest/users/me/products/9781788993173/chapters/1/sections/ch01lvl1sec11

var menuData = request("GET", menuUrl)
  
var menuParserData = JSON.parse(menuData.getBody());

var bookPath = downloadDataPath + menuParserData.data.title+"_"+isbn;

if (menuParserData.status === 'success' && menuParserData.data.earlyAccess == false) {
    if (!fs.existsSync(bookPath)) {
        fs.mkdirSync(bookPath, function(err) {
        console.log(err);
        })
    }
    // console.log(mParserData.data.imageUrl) // 이미지
    menuParserData.data.tableOfContents.forEach(element => {
        var parentID = element.id
        var baseContentUrl = "https://www.packtpub.com/mapt-rest/users/me/products/"+isbn+"/chapters/"+parentID;
        
        element.children.forEach(element => {
            console.log("start");
            var contentUrl;
            if (parentID != element.id) {
                contentUrl = baseContentUrl + "/sections/" + element.id
            } else {
                contentUrl = baseContentUrl;
            }
            
            var contentData = request("GET", contentUrl, {
                headers: {
                    "Authorization" : user
                }
            });   
            
            if (contentData.getBody() != "") {
            var contentParserData = JSON.parse(contentData.getBody());

                if (contentParserData.status === 'success') {
                    if (contentParserData.data.entitled) {
                        console.log(element.title+"  start")
                        fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+element.title+".txt", contentParserData.data.content);
                        console.log(element.title+"  finish")
                    }
                }
            } else {
                console.log("error :" +parentID+"_"+element.index+"_"+element.title)
            } 
        })
    });    
}
