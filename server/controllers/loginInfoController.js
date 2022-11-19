const catchAsync    = require('../utils/catchAsync');
const AppError      = require('../utils/appError');
const LoginInfo     = require("../models/loginInfoModel")

/*
1. what happens if username and password empty?
2. [✓] how to create a new item and reference it to the actual user? 
       just put the userId and call create() like normal
3. sequelize logs the the query if there's an error
*/
exports.createNewLoginInfo = catchAsync(async (req, res, next) => {
    LoginInfo.create({
        userId: req.userId, // get user id from token
        name: req.body.name,
        username: req.body.username,
        password: req.body.password   
    }).then( () =>  {
        res.status(201).send({ status: "Sucessfully added new item"});
    }).catch( () => {
        return next(new AppError('Failed to add new item', 401));
    });
});

/*
UNIT TESTS:
1. [✓] throw an error if user tried to delte data that doesn't exist
*/
exports.updateLoginInfo = catchAsync(async (req, res, next) => {
    const id = req.query.loginInfoId;
    const record = await LoginInfo.findByPk(id, { raw: true });
    
    if (!record) {
        return next(new AppError('Data does not exist', 404));
    }

    LoginInfo.update({ 
            name: req.query.name,
            username: req.query.username,
            password: req.query.password
        },
        { where: { loginInfoId: id } 
    }).then( () => {
        res.status(201).send({ status: "Sucessfully updated an item"});
    }).catch ( () => {
        return next(new AppError('Failed to update item', 401));
    });
});

/*
UNIT TESTS:
1. [✓] throw an error if user tried to delte data that doesn't exist
*/
exports.deleteLoginInfo = catchAsync(async (req, res, next) => {
    const id = req.query.loginInfoId;
    const record = await LoginInfo.findByPk(id, { raw: true });

    if (!record) {
        return next(new AppError('Data does not exist', 404));
    }

    LoginInfo.destroy({
        where: { loginInfoId: id }
    }).then( () => {
        res.status(201).send({ status: "Sucessfully deleted an item"});
    }).catch( () => {
        return next(new AppError('Failed to delete item', 401));
    });
});