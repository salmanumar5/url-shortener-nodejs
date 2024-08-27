const { getUser } = require("../util/auth");

async function restrucToLoggedUser(req, res, next) {

    // Log the current cookies
    console.log("Cookies:", req.cookies);

    // Retrieve the 'uid' cookie
    const userUid = decodeURIComponent(req.cookies['uid']);
    if (!userUid) {
        console.log("No uid cookie found. Redirecting to login.");
        return res.redirect("/login");
    }

    // Extract the JWT token from the 'Bearer (jwt value)' format
    const token = userUid.split('Bearer ')[1];
    if (!token) {
        console.log("No token found in uid cookie. Redirecting to login.");
        return res.redirect("/login");
    }

    // Verify and decode the token
    const user = getUser(token);
    if (!user) {
        console.log("Invalid token. Unable to find user. Redirecting to signup.");
        return res.redirect("/signup");
    }

    // Attach the user information to the request object
    req.user = user;
    next();
}


async function checkAuth(req, res, next) {
    const publicRoutes = ["/signup", "/login"];
    if (publicRoutes.includes(req.path)) {
        return next();
    }
    const userUid = req.cookies['uid'];
    
    if (!userUid) {
        // If the request is an HTML page load, redirect to signup
        if (req.accepts('html')) {
            return res.redirect("/signup");
        }
        // If it's an API request, send a JSON error response
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = userUid.split('Bearer ')[1];
    if (!token) return res.redirect("/signup");

    const user = getUser(token);
    if (!user) return res.status(401).send("Error: unable to find user");

    req.user = user;
    next();
}

module.exports = {
    restrucToLoggedUser,
    checkAuth
}
