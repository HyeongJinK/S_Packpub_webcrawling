//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&");

var request = require("sync-request");  
var cheerio = require("cheerio"); 

var fs =require('fs');
let downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyNjM2NjE0MSwiZXhwIjoxNTI2MzY5NzQxfQ.PdfBCQ15Ku8-zDfXhbjxp4La_DfPq5Wo_KkLzfwmknkq25N7x5eJMnKTpoyC9-_xtSunQEe7DlMMkNzdFY-igk7U3g2b7-6uqnwkqlM7Z1Yn5BDpqJgYs7YfSnxoxYAhbwQzDs8gQEv6rTEL86QjV-ZbWkDl__w2t8dMp0n2Lp4nC_o5iLE2saxWtxO19XBu4l_vc_Gq1ZHU0_LwoFNSqPod3qN4r1DTFacXIflYArHMRi9UPLpQCNDfdh3YPxwg4WDqCBiUiaebu2iXArQZJIxKzjBQowAOipOLD56lIYVplGtaqhmBAIcjBbM0AiahvlEUCvJIt3jdwwYZrNsjgA";

let data = fs.readFileSync("isbn_java.txt", 'utf8')
    
let isbns = data.split("\t")

for (i in isbns) {
    let isbn = isbns[i];
    let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
    
    let menuData = request("GET", menuUrl)
    let menuParserData = JSON.parse(menuData.getBody());
    let bookPath = downloadDataPath + replace(menuParserData.data.title)+"_"+isbn;

    if (menuParserData.status === 'success' && menuParserData.data.earlyAccess == false) {
        if (!fs.existsSync(bookPath)) {
            fs.mkdirSync(bookPath, function(err) {
                console.log(err);
            })
        }
        // console.log(mParserData.data.imageUrl) // 이미지
        menuParserData.data.tableOfContents.forEach(element => {
            let parentID = element.id
            let baseContentUrl = "https://www.packtpub.com/mapt-rest/users/me/products/"+isbn+"/chapters/"+parentID;
            let contentUrl;
            let contentData;
            let contentParserData;
            element.children.forEach(element => {
                if (parentID != element.id) {
                    contentUrl = baseContentUrl + "/sections/" + element.id
                } else {
                    contentUrl = baseContentUrl;
                }

                contentData = request("GET", contentUrl, {
                    headers: {
                        "Authorization" : user
                    }
                });

                if (contentData.getBody().toString('utf-8') != "") {
                    contentParserData = JSON.parse(contentData.getBody().toString('utf-8'));

                    if (contentParserData.status === 'success') {
                        if (contentParserData.data.entitled) {
                            fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+replace(element.title)+".html", contentParserData.data.content);
                            console.log(parentID+"_"+element.index+"_"+element.title)
                        } else {
                            fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+replace(element.title)+"_demo.txt", contentParserData.data.content);
                            console.log(parentID+"_"+element.index+"_"+element.title+"_demo")
                        }
                    }
                } else {
                    console.log("error :" +parentID+"_"+element.index+"_"+element.title)
                } 
            })
        });    
    }
}