const config         = require('./../config');
const jwt            = require('jsonwebtoken');
const cipher         = require('./../libs/cipher');
const catchAsync     = require('./../utils/catchAsync');
const AppError       = require('./../utils/appError');
const Users          = require("./../models/userModel");
const { promisify }  = require('util');

const signToken = id => {
    return jwt.sign(
        { id }, 
        config.JWT_SECRET, 
        { expiresIn: config.JWT_EXPIRES_IN }
    );
};

const sendToken = async (user, statusCode, res) => {
    const token = signToken(user.userId);
    const expirationTime = new Date(Date.now() + config.JWT_COOKIE_EXPIRES_IN * 60 * 1000);

    // cookie properties
    const cookieOptions = {
        expires: expirationTime,
        httpOnly: true // cannot be accessed or modified in browser, prevent XSS
    };

    // only send cookie in an https connection
    if (config.NODE_ENV === 'production')
        cookieOptions.secure = true;

    // set the cookie (sent along wit data)
    res.cookie('jwt', token, cookieOptions);

    //const sendToClient = await userController.getVault(user);
    res.status(statusCode).json({ 
        status: "success",
        idToken: token,
        expirationTime: expirationTime
    });
};

/*
UNIT TESTS:
1. [✓] What if email is not correct / doesnt exist?
2. [✓] What if password is not correct?
*/
exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const decodedPassword = Buffer.from(req.body.password, 'base64');

    // get user entry based on email
    const user = await Users.findOne({ where: { email : email }, raw: true });
    
    // UNIT TEST [1]
    if (!user) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // if user is found, get the actual master password and salt from user table
    const actualMP = user.masterPassword;

    // hash input password with the actual salt
    const actualSalt = Buffer.from(user.salt, 'base64');
    var inputMP = cipher.hashDataWithSalt(decodedPassword, actualSalt)
    inputMP = Buffer.from(inputMP).toString('base64');

    // UNIT TEST [2]
    if (!(inputMP == actualMP)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    sendToken(user, 201, res);
});

/*
UNIT TESTS:
1. [X] What if the password field is empty? cipher.hashData() will return undefined.
2. [✓] What if the email is not unique (already in database)?
3. [X] What if the VALUE of input field is empty?
*/
exports.register = catchAsync(async (req, res, next) => {
    //console.log("[REGISTER] client side => " + req.body.password);

    const decodedPassword = Buffer.from(req.body.password, 'base64');

    // hashed the master password again on server side
    const [ hashedMP, randomSalt ] = cipher.hashData(decodedPassword);

    //console.log("[REGISTER] server side => " + Buffer.from(hashedMP).toString('base64'));

    Users.create({
        name            : req.body.name,
        email           : req.body.email,
        masterPassword  : Buffer.from(hashedMP).toString('base64'),
        key             : req.body.key,           // protected symmetric key
        iv              : req.body.iv,
        salt            : Buffer.from(randomSalt).toString('base64')
    }).then(() => {
        res.status(201).send({ status: "success", message: "Your account has been successfully registered"});
    }).catch(err => {
        // UNIT TEST [2]
        if (err.message == 'Validation error')
            return next(new AppError('This Email has already been taken ', 200));

        return next(new AppError('Register failed', 200));
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // Check if token availabel in HTTP header
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
    const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);
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
   
    //console.log("[*] This user is logged in => " + currentUser.userId);
    // Grant access to protected routes
    req.userId = currentUser.userId;
    next(); // send user id to the next middleware
});