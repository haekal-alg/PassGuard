const catchAsync    = require('./../utils/catchAsync');
const AppError      = require('./../utils/appError');
const LoginInfo     = require("./../models/loginInfoModel");
const secureNote    = require('./../models/secureNoteModel');
const creditCard    = require("./../models/creditCardModel")

/*
1. what happens if username and password empty?
2. [✓] how to create a new item and reference it to the actual user? 
        > just put the userId and call create() like normal
*/
exports.createData = catchAsync(async (req, res, next) => {
    var data;
    const origin = req.url;

    // check the route to assign appropriate object
    if (origin == '/api/user/loginInfo') 
    {
        data = await LoginInfo.create({
            userId: req.userId, // get user id from token
            name: req.body.name,
            username: req.body.username,
            password: req.body.password   
        });
    }
    else if (origin == '/api/user/secureNote') 
    {
        data = await secureNote.create({
            userId: req.userId, 
            name: req.body.name,
            notes: req.body.notes
        });
    }
    else if (origin == '/api/user/creditCard') 
    {
        data = await creditCard.create({
            userId: req.userId, 
            name: req.body.name,
            holderName: req.body.holderName,
            cardNumber: req.body.cardNumber,
            brand: req.body.brand,
            expirationDate: req.body.expirationDate
        });
    }

    if (!data) {
        return next(new AppError('Failed to add new item', 401));
    }

    res.status(201).send({ status: "Sucessfully added new item"});
});

/*
UNIT TESTS:
1. [✓] throw an error if user tried to update data that doesn't exist
2. [✓] check if the data the user is updating are theirs
3. [✓] throw an error if there's a problem when updating data
*/
// [TODO] refractor the error handling so it's not repeating. 
exports.updateData = catchAsync(async (req, res, next) => {
    const origin = req.url.split('?')[0];

    // check the route to assign appropriate object
    var id, object, payload, condition;
    if (origin == '/api/user/loginInfo') 
    {
        id = req.query.loginInfoId;
        object = LoginInfo;
        payload =  {
                    name: req.query.name,
                    username: req.query.username,
                    password: req.query.password
                    };
        condition = { where: { loginInfoId: id } };
    }
    else if (origin == '/api/user/secureNote') 
    {
        id = req.query.secureNoteId;
        object = await secureNote;
        payload =  { 
                    name: req.query.name,
                    notes: req.query.notes
                };
        condition = { where: { secureNoteId: id } };
    }
    else if (origin == '/api/user/creditCard') 
    {
        id = req.query.creditCardId;
        object = creditCard;
        payload =  { 
                    name: req.query.name,
                    holderName: req.query.holderName,
                    cardNumber: req.query.cardNumber,
                    brand: req.query.brand,
                    expirationDate: req.query.expirationDate
                };
        condition = { where: { creditCardId: id } };
    }

    // UNIT TEST [1]
    const record = await object.findByPk(id, { raw: true });
    if (!record) 
        return next(new AppError('Data does not exist', 404));

    // UNIT TEST [2]
    if (record.userId != req.userId)  
        return next(new AppError('Unauthorized access', 401));

    // UNIT TEST [3]
    const data = await object.update(payload, condition);
    if (!data)
        return next(new AppError('Failed to update item', 401));


    res.status(201).send({ status: "Sucessfully updated an item"});
});

/*
UNIT TESTS:
1. [✓] throw an error if user tried to delete data that doesn't exist
2. [✓] check if the data the user is deleting are theirs
3. [✓] throw an error if there's a problem when deleting data
*/
// [TODO] refractor the error handling so it's not repeating. 
exports.deleteData = catchAsync(async (req, res, next) => {
    const origin = req.url.split('?')[0];

    // check the route to assign appropriate object
    var id, object, condition;
    if (origin == '/api/user/loginInfo') 
    {
        id = req.query.loginInfoId;
        object = LoginInfo;
        condition = { where: { loginInfoId: id } };
    }
    else if (origin == '/api/user/secureNote') 
    {
        id = req.query.secureNoteId;
        object = await secureNote;
        condition = { where: { secureNoteId: id } };
    }
    else if (origin == '/api/user/creditCard') 
    {
        id = req.query.creditCardId;
        object = creditCard;
        condition = { where: { creditCardId: id } };
    }

    // UNIT TEST [1]
    const record = await object.findByPk(id, { raw: true });
    if (!record) 
        return next(new AppError('Data does not exist', 404));

    // UNIT TEST [2]
    if (record.userId != req.userId)  
        return next(new AppError('Unauthorized access', 401));

    // UNIT TEST [3]
    const data = await object.destroy(condition);
    if (!data)
        return next(new AppError('Failed to delete item', 401));


    res.status(201).send({ status: "Sucessfully deleted an item"});
});