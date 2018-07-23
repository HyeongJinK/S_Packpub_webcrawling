﻿﻿//packpub.com 웹크롤링
//동기적으로 데이터 가져오기 비동기로 하면 너무 빨라 Ddos공격으로 의심하는 거 같음...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");

function sleep(delay) {
    let start = new Date().getTime();
    while(new Date().getTime() < start + delay);
} 

var request = require("sync-request");   
var fs =require('fs');

let downloadDataPath = "./download/"
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxM2IzN2RmYi0xNjhiLTRhZGYtYTdhNy03YzAyZjA1ZWY1MGEiLCJ1c2VybmFtZSI6Iml0ZW1wYW5nMUBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUzMjMyOTMwNiwiZXhwIjoxNTMyMzMyOTA2fQ.wxAfdts52jV7NoZAG4hhfIigKFnZlQbTX-d9TJ8Uu99iW1qog6uvaACzLkvKEXW7gkJn1ehsXCHrOWw1RIMR2Xl4YwEvBy3E_p-xfPbJ2woC1lVYhh5qHiXsLegsvU5HsgPAIUZQP0Q9JAzYl6YGQiwlvylWKPy9gQGJmrOeBpH3LB8WF5pYO8zNUZL5NRXBgzr9SfVjSYZ5G3Mb9wBfbdS-0BL-X9uW7wfs0IdAqDEQygxWnC-NrqFOxYaTrE0Tm-d0lczuSWQRAAinlEAwJpUz0wIxTcnW5tD8BBBkALuGrFI4ByrarlKKTNIeyERSN3Y0kCHKex2VC2M8N3jblg";

let data = fs.readFileSync("./downlist/isbn2.txt", 'utf8')
    
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