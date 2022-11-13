const express = require('express');
// const {PythonShell} = require('python-shell');

const router = express.Router();
const app = express();
var spawn = require('child_process').spawn
const { v4 : uuidv4 } = require('uuid');
const {Account} = require("./models/account");
const {Service} = require("./models/service");
const {Shelter} = require("./models/shelter");
const {Donation} = require("./models/donation");
const {Purchase} = require("./models/purchase");





const fileUpload =  require("express-fileupload");


app.use(fileUpload());

function vectorDistance(array1,array2){
    arr = array1.map((currentValue,index,array)=>Math.pow(array1[index]-array2[index],2));
    // console.log(arr);
    val = arr.reduce((x,y)=> {return x+y;})
    // console.log(val);
    return Math.sqrt(val);
}








app.post('/donateupload',async(req,res)=>{
    donation_amount = 10;
    randomid = uuidv4();
    face = req.files.face;
    await face.mv('./donate/' + randomid+".jpeg");
    dummy  = spawn('python3', ['embed_face.py',"donate/" + randomid+".jpeg"]);
    embed = "";
    dummy.stdout.on('data', async(data)=> {
        console.log("Hey from js")
        str = data.toString();
        if (parseInt(str) == -1){
            return res.send("Error Try Again")
        }
        console.log(str === "ERROR");
        console.log(str);
        embed  = str.split(",").map((currentValue,index,array)=>{return parseFloat(currentValue)});
        console.log(embed);
        accounts = await Account.find().exec();

        maxdist = 99999999999999999999;
        idx = 0
        flag = false;
        for (var i = 0; i < accounts.length; i++) {
            dist = vectorDistance(accounts[i].embed,embed);
            if (dist < maxdist){
                flag = true;
                idx = i;
                maxdist = dist;
            }
        }
        if (!flag){
            account = new Account({embed:embed,credit:donation_amount});
            account.save();
        }
        else
        {
            console.log(accounts[idx]._id + "Given " + donation_amount);

            accounts[idx].credit += donation_amount;
            accounts[idx].save();
        }
        res.send("donation successfull!");
    });
});




app.post('/createupload',async(req,res)=>{
    randomid = uuidv4();
    face = req.files.face;
    await face.mv( './create/' + randomid+".jpeg");
    dummy  = spawn('python3', ['embed_face.py',"create/" + randomid+".jpeg"]);
    embed = "";
    dummy.stdout.on('data', async(data)=> {
        str = data.toString();
        if (parseInt(str) == -1){
            return res.send("Error Try Again");
        }
        embed  = str.split(",").map((currentValue,index,array)=>{return parseFloat(currentValue)});
        console.log("New Account Created");
        account = new Account({embed:embed,credit:0});
        account.save();
        res.send("Creation successfull!");
    });
});









app.post('/displaycredit',async(req,res)=>{
    randomid = uuidv4() + ".jpeg";
    face = req.files.face;
    await face.mv(randomid);
    dummy  = spawn('python3', ['embed_face.py',randomid]);
    embed = "";
    dummy.stdout.on('data', async(data)=> {
        str = data.toString();
        if (parseInt(str) == -1){
            return res.send("Error Try Again")
        }
        console.log(str);
        embed  = str.split(",").map((currentValue,index,array)=>{return parseFloat(currentValue)});
        accounts = await Account.find().exec();
        maxdist = 99999999999999999999;
        idx = 0;
        flag = false;
        for (var i = 0; i < accounts.length; i++) {
            dist = vectorDistance(accounts[i].embed,embed);
            if (dist < maxdist){
                flag = true;
                idx = i;
                maxdist = dist;
            }
        }
        if (!flag){
            account = new Account({embed:embed,credit:0});
        }
        else
        {
            account = accounts[idx];

        }
        string = "ID: "+ account._id +  " Face Embed: "  +account.embed + " Credit: " + account.credit 
        res.end(string);
    });
});







app.post('/shelterupload',async(req,res)=>{ 
    charge_amount = 10;
    randomid = uuidv4()
    face = req.files.face;
    await face.mv('./shelter/' + randomid+".jpeg");
    dummy  = spawn('python3', ['embed_face.py',"shelter/" + randomid + ".jpeg"]);
    embed = "";
    dummy.stdout.on('data', async(data)=> {
        console.log("Hey from js")
        str = data.toString();
        if (parseInt(str) == -1){
            return res.send("Error Try Again")
        }
        embed  = str.split(",").map((currentValue,index,array)=>{return parseFloat(currentValue)});
        accounts = await Account.find().exec();
        maxdist = 99999999999999999999;
        idx = 0
        flag = false;
        for (var i = 0; i < accounts.length; i++) {
            dist = vectorDistance(accounts[i].embed,embed);
            if (dist < maxdist){
                flag = true;
                idx = i;
                maxdist = dist;
            }
        }
        console.log(accounts[idx].credit);
        console.log(charge_amount);

        if (!flag || accounts[idx].credit < charge_amount){
            return res.end("Insufficent Funds!");
        }
        else
        {
            console.log(accounts[idx]._id + "Charged" + charge_amount);
            accounts[idx].credit -= charge_amount;
            accounts[idx].save();
        }
        purchase = new Purchase({
            account_id : accounts[idx]._id
            });
        res.end("account charged successfully!");
    });
});







app.get("/",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/index.html");  
});  

app.get("/index.html",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/index.html");  
});  



app.get("/donate.html",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/donate.html");  
});  

app.get("/create.html",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/create.html");  
});  

app.get("/service.html",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/service.html");  
});

app.get("/display.html",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/display.html");  
});  


app.get("/assets/vendor/animate.css/animate.min.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/service.html");  
});



app.get("/assets/vendor/aos/aos.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/aos/aos.css");  
});


app.get("/assets/vendor/bootstrap/css/bootstrap.min.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/bootstrap/css/bootstrap.min.css");  
});


app.get("/assets/vendor/bootstrap-icons/bootstrap-icons.css",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/bootstrap-icons/bootstrap-icons.css");  
});


app.get("/assets/vendor/boxicons/css/boxicons.min.css",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/boxicons/css/boxicons.min.css");  
});


app.get("/assets/vendor/glightbox/css/glightbox.min.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/glightbox/css/glightbox.min.css");  
});


app.get("/assets/vendor/swiper/swiper-bundle.min.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/swiper/swiper-bundle.min.css");  
});



app.get("/assets/css/style.css",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/css/style.css");  
});



app.get("/assets/vendor/purecounter/purecounter_vanilla.js",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/purecounter/purecounter_vanilla.js");  
});



app.get("/assets/vendor/aos/aos.js",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/aos/aos.js");  
});



app.get("/assets/vendor/isotope-layout/isotope.pkgd.min.js",async(req,res)=>{
    res.sendFile(__dirname + "/Moderna/assets/vendor/isotope-layout/isotope.pkgd.min.js");  
});





app.get("/assets/vendor/bootstrap/js/bootstrap.bundle.min.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/bootstrap/js/bootstrap.bundle.min.js");  
});


app.get("/assets/vendor/glightbox/js/glightbox.min.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/glightbox/js/glightbox.min.js");  
});



app.get("/assets/vendor/waypoints/noframework.waypoints.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/waypoints/noframework.waypoints.js");  
});





app.get("/assets/vendor/swiper/swiper-bundle.min.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/swiper/swiper-bundle.min.js");  
});



app.get("/assets/vendor/php-email-form/validate.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/vendor/php-email-form/validate.js");  
});




app.get("/assets/js/main.js",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/js/main.js");  
});


app.get("/assets/img/logo.png",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/img/logo.png");  
});


app.get("/assets/img/favicon.png",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/img/favicon.png");  
});


app.get("/assets/img/hero-bg.jpg",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/img/hero-bg.jpg");  
});


app.get("/assets/img/favicon.png",async(req,res)=>{
    res.sendFile(__dirname+ "/Moderna/assets/assets/img/favicon.png");  
});







app.listen(5050);