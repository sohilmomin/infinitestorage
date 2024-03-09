const fs = require('fs');
const path = require("node:path");

exports.ExtractExtention = (pFileName) => {
    
    var re = /(?:\.([^.]+))?$/;
    return re.exec(pFileName)[1];
}

exports.generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

exports.deleteAllFilesInFolder = (folderPath) =>{
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
            console.log('Deleted file:', filePath);
        });
    });
}