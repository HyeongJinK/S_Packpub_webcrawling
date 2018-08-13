//https://translation.googleapis.com/language/translate/v2
//https://www.googleapis.com/language/translate/v2?key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o
//https://www.googleapis.com/language/translate/v2?key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q=cat
// var request = require("request");   

// var formData = {
//     key: 'AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o',
//     q: 'cat',
//     target: 'ko'
//   };
//   request.post({url:'https://www.googleapis.com/language/translate/v2', formData: formData}
//   , function optionalCallback(err, httpResponse, body) {
//     if (err) {
//       return console.error('upload failed:', err);
//     }
//     console.log('Upload successful!  Server responded with:', body);
    
//     let trStr = JSON.parse(body); 
//     console.log(trStr.data.translations[0].translatedText);
//   });

const request = require("sync-request");

let formData = "key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q=cat"
            
var res = request("post", 'https://www.googleapis.com/language/translate/v2', {
    headers: {       
            'content-type': 'application/x-www-form-urlencoded'
        },
    body: formData
    }
);
var trStr = JSON.parse(res.getBody('utf8'));
console.log(trStr);
console.log(trStr.data.translations[0].translatedText);