// models/Student.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    id: { type: Number },
    contestId: Number,
    creationTimeSeconds: Number,
    problem: {
        contestId: Number,
        index: String,
        name: String,
        rating: Number,
        tags: [String],
    },
    verdict: String,
}, {_id: false});

const ContestSchema = new mongoose.Schema({
    contestId: { type: Number},
    contestName: String,
    handle: String,
    rank: Number,
    ratingUpdateTimeSeconds: Number,
    oldRating: Number,
    newRating: Number,
}, {_id: false});

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    codeforcesHandle: { type: String, required: true, unique: true },
    
    // Codeforces Data
    currentRating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    contests: [ContestSchema],
    submissions: [SubmissionSchema],
    lastUpdated: { type: Date },

    // Inactivity Tracking
    emailRemindersEnabled: { type: Boolean, default: true },
    reminderCount: { type: Number, default: 0 },
    lastReminderSentAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);