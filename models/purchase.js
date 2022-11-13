const mongoose = require('mongoose');
const ManLee = mongoose.createConnection('mongodb://localhost/ManLee',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


const PurchaseSchema  = new mongoose.Schema({
    service_id :{
        type  : String
    },
    account_id :{
        type : String
    },
    quantity: {
        type: Number
    }
});
const Purchase = ManLee.model('Purchase',PurchaseSchema);
module.exports = {Purchase,PurchaseSchema};