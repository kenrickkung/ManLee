const mongoose = require('mongoose');
const ManLee = mongoose.createConnection('mongodb://localhost/ManLee',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


//could set budget for each site /service and have auto consents and auto refusing
const ShelterSchema  = new mongoose.Schema({
    credit :{
        type  : Number
    },
    name: {
        type: String
    }
});
const Shelter = ManLee.model('Shelter',ShelterSchema);
module.exports = {Shelter,ShelterSchema};