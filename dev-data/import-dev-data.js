const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require('fs');
const company = require('./../models/companies');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(con => console.log("Db connected"));

//Insert data to db
const companies = JSON.parse(fs.readFileSync(`${__dirname}/companies.json`, 'utf-8'));

const importData = async () => {
    try {
        await company.create(companies);
        console.log('Data Loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};


// console.log(process.argv);

importData();
