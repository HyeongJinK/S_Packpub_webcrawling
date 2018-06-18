process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var request = require("sync-request");   
var https = require('https');
var fs =require('fs');

let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "");

const user = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDBjODk3NC05OTNjLTQ2MzItODQzMS04NjY3ZmU4ZTJhOWMiLCJ1c2VybmFtZSI6InhwdG14bWRrZWwxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTUyOTAzNTE5MSwiZXhwIjoxNTI5MDM4NzkxfQ.Hi_KeCvAyK21_WI31a2TPsxd9wv8uq0iZgLAJCL9ZRKuarIIKhlCn2FXriMD8SZZ3i9AZY6ve8JAf_XBmnhCoqhrPgkuzPGalzxz71oTa7jafQ3rohjVZpeVWR0ISoeVvWT_mMkMCKLNSmqk-pyuqJMnXlvvdRVXSA2T-2dAfbV7knwLyVNAib-bbRPkWyU2PfFDYp3t1YdT2ZylMc9AfoutuVcQO1uroP6p5HwIbrLZfE3ktou4M_A8o8v0v76Jai28SZy6RNPuVWP7b877-0waW0nJLofjNtObY3ZTmrqnm-Hqf_tA7z05AcrMjhEkUKBTqFELboua-toruiwOpw";
let downloadDataPath = "./download/"
let isbn = "9781789341430";
let menuUrl = "https://www.packtpub.com/mapt-rest/products/"+isbn+"/metadata";
let menuData = request("GET", menuUrl);
let menuParserData = JSON.parse(menuData.getBody());

//console.log(menuParserData)

let bookPath = downloadDataPath + replace(menuParserData.data.title)+"_"+isbn;

if (menuParserData.status === 'success' && menuParserData.data.earlyAccess == false) {
    if (!fs.existsSync(bookPath)) {
        fs.mkdirSync(bookPath, function(err) {
            console.log(err);
        })
    }

    menuParserData.data.tableOfContents.forEach(element => {
        let parentID = element.id
        let baseContentUrl = "https://www.packtpub.com/mapt-rest/users/me/products/"+isbn+"/chapters/"+parentID;
        let contentUrl;
        let contentData;
        let contentParserData;
        element.children.forEach(element => {
            contentUrl = baseContentUrl + "/sections/" + element.id

            contentData = request("GET", contentUrl, {
                headers: {
                    "Authorization" : user
                }
            });

            if (contentData.getBody().toString('utf-8') != "") {
                contentParserData = JSON.parse(contentData.getBody().toString('utf-8'));

                if (contentParserData.status === 'success') {
                    console.log(element.title);
                    if (contentParserData.data.entitled) {
                        let file = fs.createWriteStream(bookPath+"/"+element.index+"_"+replace(element.title)+".mp4");
                        let test = https.get(contentParserData.data.content.file, (res) => {
                            res.pipe(file);
                        });
                    } else {
                        console.log("fail")
                    }
                }
            } else {
                console.log("error :" +parentID+"_"+element.index+"_"+element.title)
            } 
        })
    });    
}
//https://www.packtpub.com/mapt-rest/products/9781789343632/header-metadata

/**
 * {status: "success", httpStatus: 200,…}
data:{filepath: "sites/default/files/bookretailers/V11337_low.png", nid: 33505,…}
authorList:["Development Island"]
canonicalUrl:"/mapt/video/web_development/9781789343632"
category:"Web Development"
coverUrl:"/mapt/video/web_development/9781789343632"
description:"Learn HTML5 and CSS3 from scratch. Learn both the basics and advanced concepts and confidently build real-life projects"
filepath:"sites/default/files/bookretailers/V11337_low.png"
isbn13:"9781789343632"
nid:33505
pageTitle:"Build Real World Websites from Scratch using HTML5 and CSS3 [Video]"
productType:"video"
publicationDate:"2018-05-08T00:00:00"
title:"Build Real World Websites from Scratch using HTML5 and CSS3 [Video]"
httpStatus:200
status:"success"
*/

//https://www.packtpub.com/mapt-rest/products/9781789343632/metadata


/**
 tableOfContents:[{type: "chapter", title: "Introduction - Get your free Web Hosting – HTML", id: "60851",…},…]
    0:{type: "chapter", title: "Introduction - Get your free Web Hosting – HTML", id: "60851",…}
        children:[{type: "section", title: "Introduction ", id: "60854", index: 2,…},…]
            0:{type: "section", title: "Introduction ", id: "60854", index: 2,…}
                id:"60854"
                index:2
                seoUrl:"60851/60854/introduction"
                summary:"<p>This section introduces you to the course and gives you an overview of what you will learn from the course.</p>"
                title:"Introduction "
                type:"section"
            1:{type: "section", title: "Structure of a website ", id: "60855", index: 3,…}
            2:{type: "section", title: "Your first website ", id: "60856", index: 4,…}
            3:{type: "section", title: "Get your free web hosting ", id: "60857", index: 5,…}
            4:{type: "section", title: "Set up FireFTP ", id: "60858", index: 6,…}
            5:{type: "section", title: "Headings ", id: "60859", index: 7,…}
            6:{type: "section", title: "Paragraphs ", id: "60860", index: 8,…}
            7:{type: "section", title: "Links ", id: "60861", index: 9,…}
            8:{type: "section", title: "Images ", id: "60862", index: 10,…}
            9:{type: "section", title: "Inline vs Block Elements ", id: "60863", index: 11,…}
            10:{type: "section", title: "Iframes - Activity: Embed a nice relaxing YouTube video to your website",…}
            11:{type: "section", title: "Unordered Lists ", id: "60865", index: 13,…}
            12:{type: "section", title: "Ordered Lists ", id: "60866", index: 14,…}
            13:{type: "section", title: "Description Lists ", id: "60867", index: 15,…}
            14:{type: "section", title: "Tables ", id: "60868", index: 16,…}
            15:{type: "section", title: "Entities ", id: "60869", index: 17,…}
            16:{type: "section", title: "Forms (1) - Activity: Create a simple Login Form ", id: "60870", index: 18,…}
            17:{type: "section", title: "Forms (2) - Activity: Create a Marketplace Checkout Form ", id: "60871",…}
            18:{type: "section", title: "Text Decoration ", id: "60872", index: 20,…}
            19:{type: "section", title: "Comments ", id: "60873", index: 21,…}
            id:"60851"
        index:1
        summary:"<p>This is the first section of the course that introduces you to the course and explains some of the basic concepts of the course.</p>"
        title:"Introduction - Get your free Web Hosting – HTML"
        type:"chapter"
    1:{type: "chapter", title: "CSS", id: "60852",…}
    2:{type: "chapter", title: "Professional Project: Mathematics Tutorials Website (HTML & CSS)",…}
title:"Build Real World Websites from Scratch using HTML5 and CSS3 [Video]"
 */


 //https://www.packtpub.com/mapt-rest/users/me/products/9781789343632/chapters/60851/sections/60854

 /**
  {entitled: true, accessBlocked: false, content: {,…}}
accessBlocked:false
content:{,…}
file:"https://d1ft11egbn8l.cloudfront.net/Build Real World Websites from Scratch using HTML5 and CSS3/Package/videos/video1_1.mp4?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2QxZnQxMWVnYm44bC5jbG91ZGZyb250Lm5ldFwvQnVpbGQlMjBSZWFsJTIwV29ybGQlMjBXZWJzaXRlcyUyMGZyb20lMjBTY3JhdGNoJTIwdXNpbmclMjBIVE1MNSUyMGFuZCUyMENTUzNcL1BhY2thZ2VcL3ZpZGVvc1wvdmlkZW8xXzEubXA0IiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTI4MTk5Mjk1fX19XX0_&Signature=RfTMUlY92SXcEgCvUa-1P94ISzYzFVTO0k7oQG8FXc27q8K~qv1wnuJbLPy-~Xspb7OIQvrjXlhL8tbC2mv1JjSgKIsLQanYYdyVPfDTKHhN5f8r04EPJoUjxJeMjDrVPJv0sOE0GDGG9bajevCAgTxjAe6jMHlMBQGab-Jt9ak_&Key-Pair-Id=APKAJTJLPJQL5PVZ47FA"
type:"mp4"
entitled:true
httpStatus:200
status:"success"
  */