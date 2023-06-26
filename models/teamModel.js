const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Team name!"],
        unique: true
    },
    lead: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    //TODO: limit the digits to 6
    teamCode: {
        type: String,
        required: true,
        default: () => Math.random().toString(36).slice(8),
        index: { unique: true },
    },
    wallet: {
        type: Number,
        default: 500000
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// teamSchema.pre(/^find/, function (next) {
//     this.populate({ path: 'members', select: 'name regNo email' });
//     next();
// });

teamSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
