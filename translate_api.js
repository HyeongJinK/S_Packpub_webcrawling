//https://translation.googleapis.com/language/translate/v2
//https://www.googleapis.com/language/translate/v2?key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o
//https://www.googleapis.com/language/translate/v2?key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q=cat
var request = require("request");   

var formData = {
    key: 'AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o',
    q: 'In the previous recipes, we have already demonstrated some of the parallel stream processing techniques. In this recipe, we will discuss this in greater detail and share the best practices and possible problems and how to avoid them.',
    target: 'ko'
  };
  request.post({url:'https://www.googleapis.com/language/translate/v2', formData: formData}
  , function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });