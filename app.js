require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const { StringDecoder } = require("string_decoder");
// const { setTheUsername } = require("whatwg-url");

const app = express();

app.use(express.static("public"));
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("users", userSchema);

app.get("/", function(req, res){
    res.render("home.ejs");
})

app.get("/login", function(req, res){
    res.render("login.ejs");
})

app.get("/register", function(req, res){
    res.render("register.ejs");
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets.ejs");
        }
    })
});

app.post("/login", function(req, res){
    const email1 = req.body.username;
    const passw1 = req.body.password;
    User.findOne({email: email1}, function(err, foundItems){
        if(!err){
            if(foundItems){
                if(foundItems.password === passw1){
                    res.render("secrets.ejs");
                }
            }else{

            }
        }
    })
});
app.listen(5000, function(){
    console.log("Server Started");
})