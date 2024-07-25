const { getUser } = require("../util/auth");


async function restrucToLoggedUser(req, res, next){
    console.log("REQ:", req);
    const userUid = req.headers['authorization'];
    if(!userUid) return res.redirect("/login");

    const token = userUid.split('Bearer ')[1];
    const user = getUser(token);
    if(!user) return res.send("Error unable to find user");

    req.user = user;
        
    next();
}

async function checkAuth(req, res, next){
    const userUid = req.headers['authorization'];
    console.log("token", userUid);
    const token = userUid.split('Bearer ')[1];
    const user = getUser(token);
    console.log("User: ", user);
    req.user = user;
        
    next();
}

module.exports = {
    restrucToLoggedUser,
    checkAuth
}