const jwt           = require('jsonwebtoken');
const cipher        = require('./../cipher');
const catchAsync    = require('./../utils/catchAsync');
const AppError      = require('./../utils/appError');
const Users         = require("./../models/userModel")

/*
UNIT TESTING:
1. [X] What if the password field is empty? cipher.hashData() will return undefined.
2. [✓] What if the email is not unique (already in database)?
3. [X] What if the VALUE of input field is empty?
*/
exports.register = catchAsync(async (req, res, next) => {
    const [ hashedMP, randomSalt ] = cipher.hashData(req.body.password);
    Users.create({
        name            : req.body.name,
        email           : req.body.email,
        masterPassword  : hashedMP,
        key             : req.body.key,           // protected symmetric key
        salt            : randomSalt 
    }).then(data => {
        res.status(201).send({ status: "Register success"});
    }).catch(err => {
        let errorMessage;
        
        // UNIT TEST [2]
        if (err.message == 'Validation error') errorMessage = 'Email is been already used.'
        
        res.status(200).send({ status: errorMessage});
    });
});

/*
UNIT TESTING:
1. [✓] What if email is not correct / doesnt exist?
2. [✓] What if password is not correct?
*/
exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // get the salt and master password based on their email
    const user = await Users.findOne({ where: { email : email }, raw: true });
    
    // UNIT TEST [1]
    // if user is not found, do not continue and immediately throw an error
    if (!user) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // hash their input password with the salt
    const actualMP = user.masterPassword;
    const actualSalt = user.salt;
    const inputMP = cipher.hashDataWithSalt(password, actualSalt)

    // UNIT TEST [2]
    // if master password does not match then do not login
    if (!(inputMP == actualMP)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // if login success, give new token, protected symmetric key, and all of user's encrypted data
    res.status(201).json({
        status: 'success',
        token: 'test',
        key: 'test',
        vault: 'test'
    });
});
