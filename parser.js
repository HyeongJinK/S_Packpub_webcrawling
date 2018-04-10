// INI 파일 읽기 for Node.js

var fs  = require('fs')
var pdfreader = require('pdfreader');
var downloadDataPath = "./download/"
var isbn = 9781786462558
var bookPath = downloadDataPath + "React Native Cookbook_"+isbn;
    
// 여기서는 INI파일을 UTF-8으로 가정하고 읽는다. 
var txt = fs.readFileSync(bookPath+'/1_Adding styles to text and containers');

console.log(txt);

// function printRows() {
//     Object.keys(rows) // => array of y-positions (type: float) 
//       .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions 
//       .forEach((y) => console.log((rows[y] || []).join('')));
//   }
   
//   new pdfreader.PdfReader().parseFileItems(bookPath+'/1_Adding styles to text and containers.pdf', function(err, item){
//     if (!item || item.page) {
//       // end of file, or page 
//       printRows();
//       console.log('PAGE:', item.page);
//       rows = {}; // clear rows for next page 
//     }
//     else if (item.text) {
//       // accumulate text items into rows object, per line 
//       (rows[item.y] = rows[item.y] || []).push(item.text);
//     }
//   });
////////////////////////////////////////////////////////////////////////////
