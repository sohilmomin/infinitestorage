const {MONGOURI} = require("../../config/keys"); 
const mongoose = require('mongoose');

exports.InitDB = () => {

    mongoose.connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected with MonogoDB");
    },(err) => { 
        console.log(err); 
    });
}
