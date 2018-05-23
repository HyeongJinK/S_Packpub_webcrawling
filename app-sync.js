﻿//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "");

function sleep(delay) {
    let start = new Date().getTime();
    while(new Date().getTime() < start + delay);
} 

var request = require("sync-request");   
var fs =require('fs');

let downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyNzA2MDkwMiwiZXhwIjoxNTI3MDY0NTAyfQ.x5sAgq39Biq8KwKnnnVwE3W7gpHI76wAui3Nvs6WZv6rNaBGcfm0s0NAtKgL0j8mYK_-i7ffIXYm2sJ4CsP_8APEfWATmFnH_arw3wgMgM4TOt_WiW9Q7DiF6fTw5A6-3ud2qzMLhssSr0KeNonUCHDPj6wGmnsjWB0HOKtXVgQW9dlJ985vAl6PKjLX7QIlLkNkuGoktOXSpXlQRg3Xyr5ABUQg2SOawt57sexrTZ_Q3aMSDyqDuc6pIZrCHk625CflXum_d5YorEnjlyULiGisWYAKG4rXVdYY1BJ9etAcoEBMcVG8FmT-Olh4zwEfHo3P4istMHl4D-QNluMPlA";

let data = fs.readFileSync("./downlist/isbn_r.txt", 'utf8')
    
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
                            //sleep(200);
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