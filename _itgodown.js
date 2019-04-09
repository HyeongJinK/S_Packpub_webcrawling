process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require("sync-request");   
const https = require('https');
const http = require('http');
const fs =require('fs');
const cheerio = require("cheerio");
const Iconv = require("iconv").Iconv;

let code = "la_F010304";
let url = "http://m.itgo.kr/class_detail.asp?c_code=";
url += code;


function euckrParser(str) {
    let iconv = Iconv('euc-kr', 'utf-8');
    let buf = new Buffer.from(str, 'binary');
    return iconv.convert(buf).toString();
}

const $ = cheerio.load(euckrParser(request("GET", url).body));

let title = $("dl.m_class_cate_set b").eq(0).text();
let path = "download/"+title+"/";
if (!fs.existsSync(path)) {
    fs.mkdirSync(path, function(err) {
        console.log(err);
    })
}

$("dl.m_class_view_tt dd a span").each((i, element) => {
    let videoUrl = "http://m.itgo.kr/class_view.asp?c_code=";
    videoUrl += code;
    let fileName = $(element).text();
    let index = i + 1;
    if (index < 10) {
        videoUrl += "&path=0" + index;
    } else {
        videoUrl += "&path=" + index;
    }
    let data = request("GET", videoUrl);
    let $v = cheerio.load(euckrParser(data.body));    
    let file = fs.createWriteStream(path+index+"_"+fileName+".mp4");
    //console.log($v("p.view_ico video").attr("src"))
    http.get($v("p.view_ico video").attr("src"), (res) => {
        res.pipe(file);
        console.log(fileName);
    });
});








