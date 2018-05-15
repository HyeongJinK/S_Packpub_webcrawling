//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("sync-request");  
var cheerio = require("cheerio"); 

var fs =require('fs');
let downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZmNmNGI4MC0zNTBkLTRmZjEtODRlOC1jNWY4NWM2YmYzYzgiLCJ1c2VybmFtZSI6IndremtmbXhrMjNAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE1MjYzNTAzMDgsImV4cCI6MTUyNjM1MzkwOH0.L7QD_pGrs6tSJL7k9gBm41KPzRJHIoIRnQErpRa2PNx5LUlrtpa226U8Y1srwG6BhTcTwB3XAQUUhQ0ScNfK0lYTcLlOQ6pgVq4Jk2dqTtTkDeN6h26BrmrRhbdz6_I7jEaRZPALBXHLreVWflSfNmA_8iOS7UagIPcFB6RFjUQt2ZrKg6pOMv_GLIS19pHgGZ3744duqnwYR9ac47haE7BntH-IdSRqUk9jr1IafFGyZI2B5h6QDo9j_lDHTtwSN2V12ffEIJAgXx6R4WImUi5R2EqcH5fmJRc2Dj_cgmIHxfshVT9YoaGUJ3VI_aA__XuBHW8kiHIItjfoCCXZEw";

let data = fs.readFileSync("isbn.txt", 'utf8')
    
let isbns = data.split("\t")

for (i in isbns) {
    let isbn = isbns[i];
    let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
    
    let menuData = request("GET", menuUrl)
    let menuParserData = JSON.parse(menuData.getBody());
    let bookPath = downloadDataPath + menuParserData.data.title+"_"+isbn;

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
                            fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+element.title+".txt", contentData.getBody().toString('utf-8'));
                            console.log(parentID+"_"+element.index+"_"+element.title)
                        } else {
                            fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+element.title+"_demo.txt", contentData.getBody().toString('utf-8'));
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