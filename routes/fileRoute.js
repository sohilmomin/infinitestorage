const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const Files = require('../models/fileModel')
const { ExtractExtention } = require('../biz/helper');
const cloudStorage = require('../biz/cloudstorage');
const fs = require('fs');


const fileRouter = express.Router()
const upload = multer();

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
    .post (upload.single('file'), (req, res) => {

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file);
        cloudStorage.AddFileToStorage(req.file)
        .then (file =>{
            console.log(file);
            // Create a new File
            const newFile = new Files({
                filename: req.file.originalname,
                filenameAtTelegram: file.document.file_id,
                fileType:req.file.mimetype,
                fileExtention: ExtractExtention(req.file.originalname)
            });
            
            // Save the user to the database
            newFile.save()
            .then(file => {
                console.log('File saved:', file);
                res.status(200).send("File Uploaded Successfully");
            })
            .catch(err=>{
                console.log(err);
                console.log("Error saving the file on DB");
            })
        })
        .catch(err=>{
            console.log(err);
            console.log("Error saving the file on CloudStorage");
        })
    })

fileRouter.route("/getfile")
    .get((req,res,next)=>{

        const fileId = req.query.fileid;
        console.log("fileId:"+fileId);
        Files.find({filenameAtTelegram:fileId})
        .then(file=>{

            cloudStorage.GetFileFromStorage(fileId)
            .then(filepath=>{
                console.log(file);
                res.setHeader('filename',file[0].filename)
                res.status(200).sendFile(filepath);
            })
            .catch(err=>{
                console.log(err);
            })
        })  
        .catch(err=>{
            console.log(err);
        })

    })

module.exports = fileRouter;