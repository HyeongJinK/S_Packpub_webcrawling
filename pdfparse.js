const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('./Pro Swift Frequent Flyer Update.pdf');
 
pdf(dataBuffer).then(function(data) {
 
    // // number of pages
    // console.log(data.numpages);
    // // number of rendered pages
    // console.log(data.numrender);
    // // PDF info
    // console.log(data.info);
    // // PDF metadata
    // console.log(data.metadata); 
    // // PDF.js version
    // // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text
    //console.log(data.text);       
    
    fs.writeFileSync("pdf.txt", data.text, 'utf-8', function(e){
        if(e){
            // 파일생성 중 오류가 발생하면 오류출력
            console.log(e);
        }else{
            // 파일생성 중 오류가 없으면 완료 문자열 출력
            console.log('WRITE DONE!');
        }
      });
});

//fs.close();


//