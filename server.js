const express = require('express');
const PORT = process.env.PORT || 4000;
const {InitDB} = require("./biz/db");
const fileRouter = require('./routes/fileRoute');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const app = express();
app.use(cors(corsOptions)) // Use this after the variable declaration

// Serve frontend files statically
app.use(express.static('./frontend'));
app.use(express.json({ limit: '50mb' }));
// Setup multer for handling file uploads
app.use('/files', fileRouter)

async function InitServer () {
    const db = await InitDB ();
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    InitServer ();
});
