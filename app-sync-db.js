//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var request = require("sync-request");   
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');
var fs =require('fs');

const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyNjQ0MzczOCwiZXhwIjoxNTI2NDQ3MzM4fQ.NbwVesvczaDTSWbHXXvi9dq_LDBfZHjg0JQVjoK1QHjkHGDhT7Vng77xUevxIKMIkcGJ0petHlVHzmxGwr_cYFilmIuUBMRlgnkEScEhhKZaI96z2GJNktKa_Vmc5XqF6C8zZP18xCssoFI8s8pqGNFxIFGY-bM91DJbJV_SYkNdCv-dvHahvIMvh62sbfyjyh7bxlBE8Xpp0an_9z24J86tGLslP7RrajARZxoBWEBXhRq1riDO4zMGcqiVx0vn0QjxHjySyO6fzdrc0_XjozRL54YaqIz0P8s_Sfis3b7oDYljcHaNTTh2wHeOXVuFJHDsCqJRpW48oiW5FBSz5g";

let data = fs.readFileSync("isbn_java_down.txt", 'utf8')
    
let isbns = data.split("\t")

for (i in isbns) {
    let isbn = isbns[i];
    let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
    
    let menuData = request("GET", menuUrl)
    let menuParserData = JSON.parse(menuData.getBody());

    if (menuParserData.status === 'success' && menuParserData.data.earlyAccess == false) {
        db.serialize(function() {
            let stmt = db.prepare("INSERT INTO book VALUES (?,?,?,?)");
            
            stmt.run(isbn, menuParserData.data.title, "", menuParserData.data.imageUrl);
            
            stmt.finalize();
        }); 

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
                            db.serialize(function() {
                                let stmt = db.prepare("INSERT INTO content VALUES (?,?,?,?,?)");
                                
                                stmt.run(isbn, element.id, element.index, element.title, contentParserData.data.content);
                                
                                stmt.finalize();
                            });
                            console.log(parentID+"_"+element.index+"_"+element.title)
                        } else {
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