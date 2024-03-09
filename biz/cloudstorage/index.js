const Telegram = require("../telegram");

class CloudStorage {

  constructor() {
    this.TelegramBot = new Telegram;
  }

  async AddFileToStorage (pFile) {
    return await this.TelegramBot.SendDocument (pFile);
  }
  async GetFileFromStorage (pFile) {
    return await this.TelegramBot.GetDocument (pFile);
  }
  async GetMessages (pMsgId){
    return await this.TelegramBot.GetMessages(pMsgId);
  }
}

const cloudStorage = new CloudStorage;
module.exports = cloudStorage;

