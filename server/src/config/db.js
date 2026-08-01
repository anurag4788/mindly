const mongoose = require("mongoose");

function dbconnect(){
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
    }catch(err){
       console.error(err.message);
       process.exit(1);
    }
};

module.exports = dbconnect;