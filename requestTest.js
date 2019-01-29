var request = require("sync-request");
let awsdata = request("GET", "https://google.co.kr")
console.log(awsdata.getBody("utf-8"));