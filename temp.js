const {Shelter} = require("./models/shelter");
const {Service} = require("./models/service");

new_shelter = new Shelter({
                name:"Red Cross",
                credit : 1000
            });
new_shelter.save().then(()=>{
	bed = new Service({
		price : 15,
		description : "A bed for the night",
		name: "Bed",
		shelter_id:new_shelter._id});
	bed.save();

	food = new Service({
		price : 5,
		description : "A wholesome healthy meal",
		name: "Food",
		shelter_id:new_shelter._id});
	food.save();
	education = new Service({
		price : 25,
		description : "Tuition of a valuable skill",
		name: "Education",
		shelter_id:new_shelter._id});
	education.save();
});