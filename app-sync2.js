//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace("\n", "");

var request = require("sync-request");   
var fs =require('fs');

let downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyNjM3MDI4NSwiZXhwIjoxNTI2MzczODg1fQ.XC2O4VlNQL7FLF_SUU2alTEcecdv9Vt-OmlucEGI2nJXEJsrPrdonQmdOlcYNQ7qpMXSBEpaQ19-O_avWkW4ovVTaMHSN4oWW7DSJSCPHQc7byqgWRY61G6r9gc52J_dpRfDvVAeN_tDRJ_nirA3W1UUKtmh7TcrGtGTqXhcQVGzyqT0RKkwWyBqux57_EM8BM_e1i-H1aAYXw8S2d4qnYA0cNsD_PXr_6rUQBTldyxaeQLWg1yd0KPdKOYwdelnlpDK0DytnDtnqO58hIw9gsvV4NwfRNXMpCmCT5RffiyLmRElGsslVtr6Txj-dNeKcQUGNOYOJOCoxEnq8_WHSw";

let data = fs.readFileSync("isbn_spring.txt", 'utf8')
    
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

                if (contentData.getBody() != null && contentData.getBody().toString('utf-8') != "") {
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