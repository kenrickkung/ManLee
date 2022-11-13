const mongoose = require('mongoose');
const ManLee = mongoose.createConnection('mongodb://localhost/ManLee',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


const DonationSchema  = new mongoose.Schema({
    amount :{
        type  : Number
    },
    account_id :{
        type : String
    },
    date: {
        type: Date,
        default : () => Date.now()
    }
});
const Donation = ManLee.model('Donation',DonationSchema);
module.exports = {Donation,DonationSchema};

