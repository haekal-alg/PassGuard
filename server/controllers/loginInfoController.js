const catchAsync    = require('../utils/catchAsync');
const AppError      = require('../utils/appError');
const LoginInfo     = require("../models/loginInfoModel")

/*
1. what happens if username and password empty?
2. [✓] how to create a new item and reference it to the actual user?
*/
exports.createNewLoginInfo = catchAsync(async (req, res, next) => {
    LoginInfo.create({
        userId: req.body.id,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password   
    }).then(data => {
        res.status(201).send({ status: "Sucessfully added item"});
    }).catch(err => {
        console.log(err);
        res.status(200).send({ status: "An error has occured"});
    });
});

