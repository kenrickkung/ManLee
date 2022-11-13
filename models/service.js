const mongoose = require('mongoose');
const ManLee = mongoose.createConnection('mongodb://localhost/ManLee',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


const ServiceSchema  = new mongoose.Schema({
    price :{
        type  : Number
    },
    description :{
        type : String
    },
    shelter_id: {
        type: String
    },
    name: {
        type: String
    }
});
const Service = ManLee.model('Service',ServiceSchema);
module.exports = {Service,ServiceSchema};