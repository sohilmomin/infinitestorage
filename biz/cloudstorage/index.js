const Telegram = require("../telegram");

class CloudStorage {

  constructor() {
    this.TelegramBot = new Telegram;
  }

  async AddFileToStorage (pFile) {
    return await this.TelegramBot.SendDocument (pFile);
  }
  async GetFileFromStorage (pFile) {
    console.log("fileid at getfilefromstorage: "+ pFile)
    return await this.TelegramBot.GetDocument (pFile);
  }
  async GetFileFromStorag (pFile){
    console.log("File at test location: "+pFile);
    return pFile;
  }
}

const cloudStorage = new CloudStorage;
module.exports = cloudStorage;
