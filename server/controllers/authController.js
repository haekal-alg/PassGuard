const jwt            = require('jsonwebtoken');
const cipher         = require('./../libs/cipher');
const catchAsync     = require('./../utils/catchAsync');
const AppError       = require('./../utils/appError');
const Users          = require("./../models/userModel");
const userController = require("./userController");
const { promisify }  = require('util');

const signToken = id => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const sendTokenAndVault = async (user, statusCode, res) => {
    const token = signToken(user.userId);

    // cookie properties
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000),
        httpOnly: true // cannot be accessed or modified in browser, prevent XSS
    };

    // only send cookie in an https connection
    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;

    // set the cookie (sent along wit data)
    res.cookie('jwt', token, cookieOptions);

    const sendToClient = await userController.getVault(user);
    res.status(statusCode).json(sendToClient);
};


/*
UNIT TESTS:
1. [✓] What if email is not correct / doesnt exist?
2. [✓] What if password is not correct?
*/
exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // get user entry based on email
    const user = await Users.findOne({ where: { email : email }, raw: true });
    
    // UNIT TEST [1]
    // if user is not found, do not continue and immediately throw an error
    if (!user) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // if user is found, get the actual master password and salt from user table
    const actualMP = user.masterPassword;
    const actualSalt = user.salt;
    // hash input password with the actual salt
    const inputMP = cipher.hashDataWithSalt(password, actualSalt)

    // UNIT TEST [2]
    // if master password does not match then do not login
    if (!(inputMP == actualMP)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    sendTokenAndVault(user, 201, res);
});

/*
UNIT TESTS:
1. [X] What if the password field is empty? cipher.hashData() will return undefined.
2. [✓] What if the email is not unique (already in database)?
3. [X] What if the VALUE of input field is empty?
*/
exports.register = catchAsync(async (req, res, next) => {
    // hashed the master password again on server side
    const [ hashedMP, randomSalt ] = cipher.hashData(req.body.password);
    Users.create({
        name            : req.body.name,
        email           : req.body.email,
        masterPassword  : hashedMP,
        key             : req.body.key,           // protected symmetric key
        iv              : req.body.iv,
        salt            : randomSalt 
    }).then(() => {
        res.status(201).send({ status: "Register success"});
    }).catch(err => {
        //console.log(err)
        // UNIT TEST [2]
        if (err.message == 'Validation error')
            return next(new AppError('Duplicate email', 200));

        return next(new AppError('Register failed', 200));
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // Check if token is there
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        var token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        // [TODO] redirect to login page
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(
        new AppError('The user belonging to this token does no longer exist.', 401)
        );
    }

    // Check if user still exists
    const currentUser = await Users.findByPk(decoded.id, { raw: true });
    //console.log(currentUser);
    if (!currentUser) {
        return next(
        new AppError('The user belonging to this token does no longer exist.', 401)
        );
    }

    /*
    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
        new AppError('User recently changed password! Please log in again.', 401)
        );
    }
    */

    // Grant access to protected routes
    req.userId = currentUser.userId;
    next(); // send user id to the next middleware
});