const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    totalClicks: {
        type: String,
    },
    visitHistory: [
        {
            timestamp: {
                type: Number
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},
{timestamps: true})

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;