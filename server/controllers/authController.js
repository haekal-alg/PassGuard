const config = require("./../config");
const jwt = require("jsonwebtoken");
const cipher = require("./../libs/cipher");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const Users = require("./../models/userModel");
const { promisify } = require("util");
const { decode } = require("punycode");

// create token
const signAccessToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

const signEmailVerificationToken = (id) => {
  return jwt.sign({ id }, config.EMAIL_SECRET, {
    expiresIn: config.EMAIL_EXPIRES_IN,
  });
};

const sendToken = async (user, statusCode, res) => {
  const token = signAccessToken(user.userId);
  const expirationTime = new Date(
    Date.now() + config.JWT_COOKIE_EXPIRES_IN * 60 * 1000
  );

  // cookie properties
  const cookieOptions = {
    expires: expirationTime,
    httpOnly: true, // cannot be accessed or modified in browser, prevent XSS
  };

  // only send cookie in an https connection
  if (config.NODE_ENV === "production") cookieOptions.secure = true;

  // set the cookie (sent along wit data)
  res.cookie("jwt", token, cookieOptions);

  //const sendToClient = await userController.getVault(user);
  res.status(statusCode).json({
    status: "success",
    idToken: token,
    expirationTime: expirationTime,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const decodedPassword = Buffer.from(req.body.password, "base64");

  // get user entry based on email
  const user = await Users.findOne({ where: { email: email }, raw: true });

  // UNIT TEST [1] -> if email does not exist
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //console.log(`Email verification => ${user.emailVerified}`)
  // UNIT TEST [2] -> if email is not verified
  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email to access your vault", 401)
    );
  }

  // if user is found, get the actual master password and salt from user table
  const actualMP = user.masterPassword;

  // hash input password with the actual salt
  const actualSalt = Buffer.from(user.salt, "base64");
  var inputMP = cipher.hashDataWithSalt(decodedPassword, actualSalt);
  inputMP = Buffer.from(inputMP).toString("base64");

  // UNIT TEST [2] -> if password is not correct
  if (!(inputMP == actualMP)) {
    return next(new AppError("Incorrect email or password", 401));
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
  const decodedPassword = Buffer.from(req.body.password, "base64");

  // hashed the master password again on server side
  const [hashedMP, randomSalt] = cipher.hashData(decodedPassword);
  //console.log("[REGISTER] server side => " + Buffer.from(hashedMP).toString('base64'));

  try {
    await Users.create({
      name: req.body.name,
      email: req.body.email,
      masterPassword: Buffer.from(hashedMP).toString("base64"),
      key: req.body.key, // protected symmetric key
      iv: req.body.iv,
      salt: Buffer.from(randomSalt).toString("base64"),
    });

    const currentUser = await Users.findOne({
      where: { email: req.body.email },
      raw: true,
    });

    const confirmationToken = signEmailVerificationToken(currentUser.userId);
    const confirmationURL = `${req.protocol}://${req.get(
      "host"
    )}/api/verification/${confirmationToken}`;

    message = `
        <div>
        Welcome ${req.body.name} and thank you for signing up with Passguard! 
        <br />
        You must confirm your email by clicking the link below to access your vault.
        The link is expired within 24 hours.
        <br />
        <br />
        <a href=${confirmationURL}>${confirmationURL}</a>
        <br />
        <br />
        Thank you,
        <br />
        Passguard Team
        </div>
        `;
    await sendEmail({
      email: req.body.email,
      subject: "Confirm your email on PassGuard",
      message,
    });

    res
      .status(201)
      .send({ status: "success", message: "Successfully registered" });
  } catch (err) {
    // UNIT TEST [2]
    if (err.message == "Validation error")
      return next(new AppError("This Email has already been taken ", 200));

    console.log(err)
    return next(new AppError("Register failed", 200));
  }
});

exports.verify = catchAsync(async (req, res, next) => {
  let token = req.url.split("/").at(-1);
  // Verification token
  const decoded = await promisify(jwt.verify)(token, config.EMAIL_SECRET);

  if (!decoded) {
    return next(new AppError("Invalid Verification Token", 401));
  }

  const currentUser = await Users.update(
    { emailVerified: true },
    { where: { userId: decoded.id } }
  );

  if (config.NODE_ENV == "development") {
    return res.redirect("http://localhost:3000/login?email_verified=true");
  }
  
  return res.redirect("/login?email_verified=true");
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check if token availabel in HTTP header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    var token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);
  if (!decoded) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // Check if user still exists
  const currentUser = await Users.findByPk(decoded.id, { raw: true });
  //console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
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
