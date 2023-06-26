const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String
    },
    volume: Number,
    price: Number
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
