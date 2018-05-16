//파일 목록 가져오기

var fs =require('fs');
let replace2 = (s) => s.replace(/\@/g, "?").replace(/\[/g, "<").replace(/\]/g, ">").replace(/\-/g, ":").replace(/\+/g, "*").replace(/\\/g, " ").replace(/\&/g, "/").replace("\n", "");
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        console.log(replace2(files[i].substr(0, files[i].lastIndexOf("_"))));
        console.log(files[i].substr(files[i].lastIndexOf("_")+1, 13))

        let subfiles = fs.readdirSync(name);
        // if (fs.statSync(name).isDirectory()){
        //     getFiles(name, files_);
        // } else {
        //     files_.push(name);
        // }
    }
    return files_;
}
getFiles('./download')
//console.log(getFiles('./download'))