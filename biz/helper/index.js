exports.ExtractExtention = (pFileName) => {
    
    var re = /(?:\.([^.]+))?$/;
    return re.exec(pFileName)[1];
}