const mongoose = require('mongoose');
const ManLee = mongoose.createConnection('mongodb://localhost/ManLee',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


const AccountSchema  = new mongoose.Schema({
    embed :{
        type  : [Number]
    },
    credit: {
        type: Number
    }
});
const Account= ManLee.model('Account',AccountSchema);
module.exports = {Account,AccountSchema};