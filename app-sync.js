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
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyNzEzNjU5MiwiZXhwIjoxNTI3MTQwMTkyfQ.uRsGwzIwkYHCBNPfHKBoWFdMkFtZWh0UY6cvdRaneiz9s-vtwYAyxP8pZD21eUp8tsJHCKZ0pRAT2nAoZOV8ZhJiQ__OEq4rxRHkgpBp-IYX6U-zf4Mx5kgePKYk1EarYNqo04_fmzfsmL5x4YV0BqDHdphx94Dq53SLL6W2aZ7A6KmNTJwpVM8V5kqyWOCf5g0L2OtLxRyvThylObAUS35kYJS3JLy7sktLIPZDP8TRcsAjmdSYio3X_YA9v58uQIsz1eAcU_JfiULa6RMpW_246l1RxQkIFezAyaMm9bjom-I5_tpOQfb8K9JhpsJefkN2Si8ZI9PB-rsDqylfmw";

let data = fs.readFileSync("./downlist/isbn_r.txt", 'utf8')
    
let isbns = data.split("\t")

for (i in isbns) {
    let isbn = isbns[i];
    let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
    
    let menuData = request("GET", menuUrl)
    let menuParserData = JSON.parse(menuData.getBody());
	if (menuParserData.data.title.indexOf("[Video]") == -1) {
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
}