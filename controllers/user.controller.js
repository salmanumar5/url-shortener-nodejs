const User = require("../models/user.model")
const {v4: uuid} = require('uuid')
const {setUser, getUser} = require("../util/auth")

async function handleUserSignUp(req, res){
    const {name, email, password} = req.body
    await User.create({
        name,
        email,
        password,
    })
    return res.redirect("/")
}

async function handleUserLogin(req, res){
    const { email, password} = req.body;
    const user = await User.findOne({ email, password});
    if(!user){
        return res.render("login", {error: "Invlaid email or password"})
    }
        


    const token = setUser(user);
    // res.cookie("uid", token);
   
    return res.json({token}) 
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
}