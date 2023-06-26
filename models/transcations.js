const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team'
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
    },
    transactions: [{
        type: {
            type: String,
            enum: ['buy', 'sell']
        },
        volume: {
            type: Number
        },
        priceOfStock: {
            type: Number
        },
        totalPrice: {
            type: Number
        },
    }],
    totalVolume: Number
});

transactionSchema.pre(/^find/, function (next) {
    // this.populate({ path: 'teamId', select: 'name lead members teamCode wallet' });
    // this.populate({ path: 'company', select: 'name volume price' });
    next();
});

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
