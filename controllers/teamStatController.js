const catchAsync = require("../utils/catchAsync");
const Transaction = require("../models/transcations");
const Team = require("../models/teamModel");
const Companies = require("../models/companies");
const AppError = require("../utils/appError");

exports.teamStat = catchAsync(async (req, res, next) => {
  const team = await Team.findOne({ members: req.user.id });
  if (!team) return next(new AppError("No team found with this user!", 400));

  const transactions = await Transaction.find({ teamId: team._id });
  var sum = 0;
  var sum2 = 0;
  var total=0;
  var percent;
  for (let index = 0; index < transactions.length; index++) {
    let noofstocks = 0;
    // for (
    //   var index2 = 0;
    //   index2 < transactions[index].transactions.length;
    //   index2++
    // ) {
    //   if (transactions[index].transactions[index2].type === "buy") {
    //     noofstocks =
    //       noofstocks + transactions[index].transactions[index2].volume;
    //      x=transactions[index].transactions[index2].volume *
    //     transactions[index].transactions[index2].priceOfStock;
    //     sum =
    //       sum +x

    //   } else if (transactions[index].transactions[index2].type === "sell") {
    //     noofstocks =
    //       noofstocks - transactions[index].transactions[index2].volume;
    //     sum =
    //       -sum +
    //       transactions[index].transactions[index2].volume *
    //         transactions[index].transactions[index2].priceOfStock;
    //   }
    // }
    //   for (let i = 0; i < companies.length; i++) {
    //     if (companies[i]._id==transactions[index].company) {
    //       console.log(companies[i]._id)

    //     }
    //     console.log(companies[i]._id,transactions[index].company)
    // }
    var companies = await Companies.findOne({
      _id: transactions[index].company,
    });
    // console.log(companies);
    if (transactions[index].totalVolume === 0) {
      for (let index2 = 0; index2 < transactions[index].transactions.length; index2++) {
        
          if (transactions[index].transactions[index2].type === "buy") {
            sum2= sum2+transactions[index].transactions[index2].priceOfStock*transactions[index].transactions[index2].volume
  
          }
          else  if (transactions[index].transactions[index2].type === "sell") {
            sum2= -sum2+transactions[index].transactions[index2].priceOfStock*transactions[index].transactions[index2].volume

          }
          // console.log(sum2);
               
      } 
    }
    sum = sum + transactions[index].totalVolume * companies.price;

    // if (noofstocks!=0) {
    //   sum=sum - x + noofstocks*companies.price
    // }

    // sum = sum + team.wallet;
  }
  total=sum+sum2+team.wallet
percent=((total-500000)/500000)*100
  res.status(200).json({
    status: "success",
    sum,

    total,
    percent
  });
});
