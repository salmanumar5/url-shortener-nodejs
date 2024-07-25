const URL = require('../models/url.model')
const shortid = require('shortid');

async function handleGenerateNewShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).send({error: "Url is Required"})
    const shortId = shortid();

    await URL.create(
        {
            shortId: shortId,
            redirectUrl: body.url,
            visitHistory: [],
            createdBy: req.user._id

        }
    );
    return res.render("home", {id: shortId})
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;

    const result = await URL.findOne({shortId})

    return res.json(
        {
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        }
    )
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}