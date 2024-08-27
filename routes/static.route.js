const express = require('express');
const URL = require('../models/url.model');
const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.user) return res.redirect("/login");

    const allUrls = await URL.find({createdBy: req.user._id })
    return res.render("home", {urls: allUrls})
})

router.get('/signup', (req, res) => {
    try {
        return res.render("signup");
    } catch (error) {
        console.error("Error rendering signup page:", error);
        return res.status(500).send("Internal Server Error");
    }
});


router.get('/login', (req, res) => {
    return res.render("login")
})


module.exports = router;