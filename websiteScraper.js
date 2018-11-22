var scrape = require('website-scraper');
var options = {
  urls: ['https://smartadmin-html.firebaseapp.com'],
  directory: '/scraper/',
};
 
// with promise
scrape(options).then((result) => {
    /* some code here */
    console.log(result[0])
}).catch((err) => {
    /* some code here */
});