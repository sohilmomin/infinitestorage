//libs
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs').promises;
const filesys = require('fs');
const path = require("node:path");
const {filesize} = require('filesize');

//db
const Files = require('../models/fileModel')

//modules
const cloudStorage = require('../biz/cloudstorage');

//helpers
const { ExtractExtention, generateRandomString, deleteAllFilesInFolder } = require('../biz/helper');
const { EncryptFile, DecryptFile}  = require("../biz/crypt/encrypt");

//envs
const { ACCESS_SECRET } = require('../config/keys');

const fileRouter = express.Router()
const upload = multer({ dest: 'uploads/' });

fileRouter.use(bodyParser.json())

fileRouter.route('/')
    .get((req, res, next) => {

        Files.find(req.query)
            .then(files => {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json(files)
            }, (err) => next(err))
            .catch((err) => {
                res.status(422).json(err)
                next(err)
            })
    })
    // File upload endpoint
    .post (upload.single('file'), async (req, res) => {

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        if(req.body.accesskey != ACCESS_SECRET){
            return res.status(400).send({message:"Nice Try! Wrong Access Key\n"});
        }
        const encryptedFile = path.join(__dirname,"../uploads/",generateRandomString(16));
        const fileSize = filesize(filesys.statSync(req.file.path).size,{standard:'jedec'});
        
        EncryptFile(req.file.path,encryptedFile, ()=>{
            cloudStorage.AddFileToStorage(encryptedFile)
            .then (file =>{
                // Create a new File
                const newFile = new Files({
                    fileName: req.file.originalname,
                    fileId: file.id,
                    fileType:ExtractExtention(req.file.originalname),
                    fileSize: fileSize,
                });
                return newFile.save()
            })
            .then(file =>{
                deleteAllFilesInFolder(path.join(__dirname,"../uploads/"));
                res.status(200).send({message:"File Uploaded Successfully!"});
            })
            .catch(err=>{
                deleteAllFilesInFolder(path.join(__dirname,"../uploads/"));
                console.log("Error saving the file on CloudStorage");
                res.status(400).send({message:"Error Saving File on Cloud Storage!"});
            })
        });
    })

fileRouter.route("/getfile")
    .get((req,res,next)=>{

        const fileId = req.query.fileid;
        var fileName = undefined;
        var filePath = undefined;
        const downloadedFile = path.join(__dirname,"../uploads/",generateRandomString(16));

        console.log("fileId:"+fileId);

        Files.findOne({fileId:fileId})
        .then(file=>{

            filePath = path.join(__dirname,"../uploads/",file.fileName);
            fileName = file.fileName;

            return cloudStorage.GetMessages(fileId)
        })
        .then(pMsg=>{
            console.log(pMsg[0]);
            return cloudStorage.GetFileFromStorage(pMsg[0]);
        })
        .then(fileBuffer=>{
            return fs.writeFile(downloadedFile, fileBuffer)
        })
        .then(()=>{
            //decrypt
            DecryptFile(downloadedFile,filePath,()=>{
                res.setHeader('filename',fileName);
                res.status(200).sendFile(filePath);
                deleteAllFilesInFolder(path.join(__dirname,"../uploads/"));
            });
        })
        .catch(err=>{
            deleteAllFilesInFolder(path.join(__dirname,"../uploads/"));
            console.log(err)
        })
    })

module.exports = fileRouter;