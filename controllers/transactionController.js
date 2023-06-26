const Transaction = require('./../models/transcations');
const Team = require('./../models/teamModel');
const Companies = require('./../models/companies');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addTransaction = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ members: req.user.id });
    if (!team) return next(new AppError('No team found with this user!', 400));

    const { type, company, volume } = req.body;
    if (!type || !company || !volume) return next(new AppError('Enter all the details type,company,volume,price', 400));

    //Checks if required amount of stocks are there or not
    const stock = await Companies.findById(company);
    if (stock.volume < volume) return next(new AppError(`No of stocks left in ${stock.name} is ${stock.volume}`, 400));
    const totalCost = volume * stock.price;
    if (totalCost > team.wallet) return next(new AppError('Insufficient Funds!!', 400));

    //Checks if the user had the stock or not
    const chkTransaction = await Transaction.findOne({ teamId: team._id, company: stock._id });
    if (!chkTransaction && type == 'sell') return next(new AppError(`You don't have the stocks of this company to sell`, 400));
    if (chkTransaction && type == 'sell' && (volume > chkTransaction.totalVolume)) return next(new AppError(`You have only ${chkTransaction.totalVolume}`, 400));

    if (!chkTransaction) {
        transaction = await Transaction.create({
            teamId: team._id,
            company: stock._id,
            transactions: {
                type: type,
                volume: volume,
                priceOfStock: stock.price,
                totalPrice: totalCost
            },
            totalVolume: volume
        });
        if (type == 'buy') {
            stock.price = stock.price + (volume * 0.1);
            stock.volume -= volume;
            await stock.save();

            team.wallet -= totalCost;
            await team.save();
        }
    }
    else if (chkTransaction) {
        chkTransaction.transactions.push({
            type: type,
            volume: volume,
            priceOfStock: stock.price,
            totalPrice: totalCost
        });
        if (type == 'buy') {
            stock.price += (volume * 0.1);
            chkTransaction.totalVolume += volume;
            team.wallet -= (totalCost * 1).toFixed(2);
        }
        else if (type == 'sell') {
            stock.price = stock.price - (volume * 0.1);
            chkTransaction.totalVolume -= volume;
            console.log(((stock.price * 1) * (volume * 1)).toFixed(2));
            team.wallet += ((stock.price * 1) * (volume * 1)).toFixed(2);
        }

        await stock.save();
        await chkTransaction.save();
        await team.save();
    }

    res.status(200).json({
        status: 'success',
        team,
        stock,
        chkTransaction
    });
});

exports.getAllTransactions = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ members: req.user.id });
    if (!team) return next(new AppError('No team found with this user!', 400));

    const transactions = await Transaction.find({ teamId: team._id });
    res.status(200).json({
        status: 'success',
        transactions
    });
});

exports.getAllCompanies = catchAsync(async (req, res, next) => {
    const companies = await Companies.find();
    res.status(200).json({
        status: 'Success',
        length: companies.length,
        companies
    });
});