const {TELEGRAM_TOKEN, TELEGRAM_BOT_ID} = require("../../config/keys");
const TelegramBot = require('node-telegram-bot-api');
const path = require("node:path");
module.exports = class Telegram { 
    constructor (pPoling){
        this.botHandler = this.InitBot (pPoling);
    }

    async InitBot (pPoling){
        return await new TelegramBot (TELEGRAM_TOKEN, {polling: pPoling});
    }

    async SendDocument (pDocument){
        const fileOptions = {
            filename: pDocument.filename
        }
        //return  (await this.botHandler).sendMessage(TELEGRAM_BOT_ID,"Hello");
        return await (await this.botHandler).sendDocument(TELEGRAM_BOT_ID, pDocument.buffer,{}, fileOptions);
    }

    async GetDocument (pDocument){

        const newpath = path.join(__dirname,"../../uploads/");
        return await (await this.botHandler).downloadFile(pDocument,newpath);
    }
}
