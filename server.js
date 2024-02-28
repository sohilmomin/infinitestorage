const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const fileRouter = require('./routes/fileRoute');
const {InitDB} = require("./biz/db");
const fs = require('fs');
// Serve frontend files statically
app.use(express.static('./frontend'));
app.use(express.json({ limit: '50mb' }));
// Setup multer for handling file uploads
app.use('/files', fileRouter)

async function InitServer () {
    const db = await InitDB ();
}

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const apiId = 16554028;
const apiHash = "1e9c2b0a039d33d3beebe50813bfecd9";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  //await client.connect();
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  await client.sendMessage(2103344120, { message: "Hello!" });
  const res = await client.sendFile(2103344120,{file:"./uploads/file_1.pdf"});
  console.log(res);
  console.log("id is : " + res.id);

  const msg = await client.getMessages(2103344120,{ids:res.id});
  console.log("got the message" + msg);
  const buffer = await client.downloadMedia(msg[0],{}).then(response=>{
    response.on("data",function(chunk){
        console.log(chunk);
    })
  });
  console.log("got the buffer");
  await fs.writeFile("file_3.pdf",buffer,(err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
    }
  });
  /*
  const result = await client.invoke(new Api.upload.getFile({
    precise:true,
    cdnSupported:true,
    location:,
    offset:0
  }))
  console.log(result);
  */
})();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    InitServer ();
});
