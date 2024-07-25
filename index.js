const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {restrucToLoggedUser, checkAuth} = require('./middleware/auth.middleware')

const { connectMongoDb } = require('./connect');
const dotenv = require('dotenv');
const URL = require('./models/url.model');

const urlRoute = require('./routes/url.route');
const staticRoute = require('./routes/static.route');
const userRoute  = require('./routes/user.route');

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use("/url", restrucToLoggedUser, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute)

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    }
                },
            },
            { new: true } // Return the updated document
        );

        console.log("Entry",entry);

        if (!entry) {
            console.log(`Short URL ${shortId} not found`);
            return res.status(404).send('Short URL not found');
        }

        console.log(`Redirecting user to: ${entry.redirectUrl}`);
        res.redirect(302, entry.redirectUrl);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).send('Internal Server Error');
    }
});


connectMongoDb(process.env.URL).then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
        console.log(`Server listening at ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("MongoDB connection failed", err);
});
