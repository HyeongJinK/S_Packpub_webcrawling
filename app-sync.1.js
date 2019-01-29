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
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmI2Zjk3ZC1iMDRlLTRhYmYtODc5NC04ZmEyYmM5ZjAwMzciLCJ1c2VybmFtZSI6InBhY2twdWIxQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTQ4NzI4MDgwLCJleHAiOjE1NDg3MzE2ODB9.q4eXqsyHcNYLQDDF91ObbK7LisiN-ckJd7ghepB9gpQiZktQudptDaxRufe1xd0bfQlJTGnhhk7Dg6tmLdIeb7KW44tB2fLxY8M1DAKnpFl1LoRMApkPmlzK9vOIk_j96yYw4La49QCbAibSFswPcg7NGFHebL3WoSrsfa-jYdN4NywE2ElUbEmMoiNuzynRsl5ju-Cflsv_ykKmc6U6DS3GdPt6prpgqeEJLHWir5tctvzhRXgN0vgigp0t2u55afkiLSwJwhIUldysO3JXUCkDXltThW1rDAtIjypOLsXRYW143M1YAJBcLiDV7zu3QWbh35QpoLgyBRpF8yzmiQ";

let data = fs.readFileSync("./downlist/isbn3.txt", 'utf8')
    
let isbns = data.split("\t")
let isbn = 9781789615265
	//https://www.packtpub.com/mapt-rest/products/9781789615265/metadata
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
			//
			//let baseContentUrl = "https://www.packtpub.com/mapt-rest/users/me/products/"+isbn+"/chapters/"+parentID;
			let baseContentUrl = "https://services.packtpub.com/products-v1/products/"+isbn+"/"+parentID
			let contentUrl;
			let contentData;
			let contentParserData;
			element.children.forEach(element => {
				if (element.index > 0) {
					if (parentID != element.id) {
						contentUrl = baseContentUrl +"/"+ element.id
					} else {
						if (element.id < 10) {
							contentUrl = baseContentUrl + "/ch0" + element.id;
						} else {
							contentUrl = baseContentUrl + "/ch" + element.id;
						}
					}
					
					//console.log(contentUrl)
					contentData = request("GET", contentUrl, {
						headers: {
							"Authorization" : user
						}
					});
					
					if (contentData.getBody().toString('utf-8') != "") {
						contentParserData = JSON.parse(contentData.getBody().toString('utf-8'));
						//console.log("====================================================")
						//console.log(contentParserData.data)
						//console.log("====================================================")
						let awsdata = request("GET", contentParserData.data)
						fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+replace(element.title)+".html", awsdata.getBody("utf-8"));
						console.log(parentID+"_"+element.index+"_"+element.title)
					}
				}
			})
		});    
	}
}
	
	