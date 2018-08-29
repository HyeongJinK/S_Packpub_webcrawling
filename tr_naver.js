const request = require("sync-request");

let formData = "source=en&target=ko&text=cat"

try {
    var res = request("post", 'https://openapi.naver.com/v1/papago/n2mt', {
        headers: {       
                'content-type': 'application/x-www-form-urlencoded'
                , 'X-Naver-Client-Id': 'PIzcrH8b_OVhgqHKguPr'
                , 'X-Naver-Client-Secret': 'IC57QXbTkQ'
            },
        body: formData
        }
    );
    var trStr = JSON.parse(res.getBody('utf8'));
    let trText = trStr.message.result.translatedText 
    console.log(trStr);
    console.log(trText);
} catch(e) {
    //console.log(e.body);
}
