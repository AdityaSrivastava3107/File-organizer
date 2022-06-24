let inputArr=process.argv.slice(2);
let fs= require("fs");
let path = require("path");
console.log(inputArr); 
let command = inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch(command){
    case "tree" :{
        treeFn(inputArr[1]);
        break;
    }
    case "organize" :{
        organizeFn(inputArr[1]);
        break;
    }
    case "help" :{
        helpFn(); 
        break;
    }
    default:{
        console.log("Please send right command.");
        break;
    }
}
function treeFn(dirPath, indent){
    //console.log("Tree command implemented for", dirPath);
    //let destPath;
      if(dirPath==undefined){
        console.log("Please enter valid path.");
        return;
    }
    else{
       let doesExist = fs.existsSync(dirPath);
       if(doesExist){
         treeHelper(dirPath);
       }
       else{
        console.log("Please enter the correct path");
        return;
       }
        

      }
}
function treeHelper(dirPath, indent){
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile==true) {
        let fileName = path.basename(dirPath);
        console.log(indent+ "├──" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0; i<childrens.length; i++){
            let childPath =  path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }

    }
}
function organizeFn(dirPath){
      //console.log("Organize command implemented for", dirPath);
      let destPath;
      if(dirPath==undefined){
        console.log("Please enter valid path.");
        return;
    }
    else{
       let doesExist = fs.existsSync(dirPath);
       if(doesExist){
        destPath = path.join(dirPath, "organized_files");
        if(fs.existsSync(destPath)==false){
        fs.mkdirSync(destPath);
    }

       }
       else{
        console.log("Please enter the correct path");
        return;
       }
        

      }
     organizeHelper(dirPath,destPath); 

      
}
function helpFn(){
    console.log(`
    list of all the commands:
    node main.js tree "directoryPath"
    node main.js organize "directoryPath"
    node main.js help
    `);
}
function organizeHelper(Downloads,dest){
    let childNames = fs.readdirSync(Downloads);
    //console.log(childNames);
    for(let i=0; i<childNames.length; i++){
        let childAddress = path.join(Downloads,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            //console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to >",category);
            sendFiles(childAddress,dest,category);
        }
    }
}
function sendFiles(DownloadsFile,dest,category){
    let categoryPath= path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
       fs.mkdirSync(categoryPath); 
    }
    let fileName = path.basename(DownloadsFile);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(DownloadsFile, destFilePath);
    fs.unlinkSync(DownloadsFile);
    console.log(fileName, "copied to", category);
}
function getCategory(names){
    let ext = path.extname(names);
    ext=ext.slice(1);
    for(let type in types){
        let currentTypeArr = types[type];
        for(let i=1; i<currentTypeArr.length; i++){
            if(ext==currentTypeArr[i]){
                return type;
            }
        }
    }
    return "others";
}