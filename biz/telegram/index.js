const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const {TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_BOT_ID,TELEGRAM_PHONE_NUMBER, TELEGRAM_SESSION} = require("../../config/keys");
const input = require("input"); // npm i input

module.exports = class Telegram { 
    constructor (){
        this.clientHandler = this.InitClient ();
    }

    async InitClient (){

        const stringSession = new StringSession(TELEGRAM_SESSION);
        const client = await new TelegramClient(stringSession, TELEGRAM_API_ID, TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });
        await client.start({
            phoneNumber: TELEGRAM_PHONE_NUMBER,
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () =>
            await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        });
        console.log(client.session.save());
        return client;
    }

    async SendDocument (pDocument){
        return await (await this.clientHandler).sendFile(TELEGRAM_BOT_ID,{file:pDocument});;
    }

    progressFunc(total_size,download){
        console.log("total :" +total_size);
        console.log("downloaded: " + download);
    }
    async GetDocument (pMsg){

        return await (await this.clientHandler).downloadMedia(pMsg,{progressCallback:this.progressFunc}) //this will return a buffer
        
    }
    async GetMessages(pMsgId){
        return await (await this.clientHandler).getMessages(TELEGRAM_BOT_ID,{ids:Number(pMsgId)});
    }
}
