﻿//packpub.com 웹크롤링
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
const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmI2Zjk3ZC1iMDRlLTRhYmYtODc5NC04ZmEyYmM5ZjAwMzciLCJ1c2VybmFtZSI6InBhY2twdWIxQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwic3Vic2NyaXB0aW9uIjpbImFsbCJdLCJwZXJtcyI6IkFBQUFBQUFBQUFBQUFBQUFBQUE9IiwiaWF0IjoxNTQ4OTA4OTk0LCJleHAiOjE1NDg5MTI1OTR9.ZP5-TiihVrGq6DWMmK3BYvG0k2BEEGDm8PCSB4wEhHG7isqkKKuIQ2qBijpQIIh0KzYuqj3bZ2vH9UZUkLB55xne8ldd1Su-oMTJoZe7_RZHZAx6qlUiytGcOV2h7o-pMtP0Glv4-XXv6vG8CwcsVM9--xg34jlsJLnyP31-Qn_yHfcmgnkh2QagVquomG80NwAT95-wHXYO23-PqbbzyJOC-vhSQNnCgnkwEbOFs_LK6QCo1UW3njhck83NHZkllIYWB5gFu1WbyGocVUF-X_znMdIZkh5P2lCjx7_3xFDQoO4IjZ-sOHNX2TjZcKQXRYvKRISMFKOYmW3Us6ixTA";
const elid = 0;
let data = fs.readFileSync("./downlist/isbn3.txt", 'utf8')
    
let isbns = data.split("\t")

for (i in isbns) {
	let isbn = isbns[i];
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
                    if (parentID != element.id) {
						contentUrl = baseContentUrl +"/"+ element.id
					} else {
						if (element.id.match("ch") != null || element.id.match("app") != null || element.id.match("backindex") != null) {
							contentUrl = baseContentUrl + "/" + element.id;
						} else if (element.id < 10) {
							contentUrl = baseContentUrl + "/ch0" + element.id;
						} else {
							contentUrl = baseContentUrl + "/ch" + element.id;
						}
					}
                    
                    //console.log(contentUrl)
                    let me = request("GET", "https://services.packtpub.com/users-v1/users/me/metadata", {
                        headers: {
                            "Authorization" : user
                    }});
                    me.getBody("utf-8");
                    contentData = request("GET", contentUrl, {
                        headers: {
                            "Authorization" : user
                        }
                    });
                    
                    if (contentData.getBody().toString('utf-8') != "") {
                        contentParserData = JSON.parse(contentData.getBody().toString('utf-8'));
                        let awsdata = request("GET", contentParserData.data)
						let str = awsdata.getBody().toString("utf-8");
						
						fs.writeFileSync(bookPath+"/"+parentID+"_"+element.index+"_"+replace(element.title)+".html", str);
						console.log(parentID+"_"+element.index+"_"+element.title)		
                    }
				})
			});    
		}
	}
}