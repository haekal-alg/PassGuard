const LoginInfo     = require("./../models/loginInfoModel");
const secureNote    = require("./../models/secureNoteModel");
const creditCard    = require("./../models/creditCardModel");
const catchAsync    = require('./../utils/catchAsync');
const Users          = require("./../models/userModel");

/*
UNIT TEST:
1. what if the data is empty? server returns empty response
*/
exports.sync = catchAsync(async (req, res, next) => {
    const user = await Users.findByPk(req.userId, { raw: true });

    // get all login info
    const loginData = await LoginInfo.findAll({
        where: { userId: user.userId },
        attributes: ["loginInfoId", "name", "username", "password"], 
        raw: true
    });

    // get all secure note
    const noteData = await secureNote.findAll({
        where: { userId: user.userId },
        attributes: ["secureNoteId", "name", "notes"], 
        raw: true
    });

    /*
    // get all credit card
    const creditData = await creditCard.findAll({
        where: { userId: user.userId },
        attributes: ["creditCardId", "name", "holderName", "cardNumber", "brand", "expirationDate"], 
        raw: true
    });
    */

    data = {  profile: {
                id: user.userId, 
                name: user.name, 
                email: user.email, 
                protectedKey: user.key,
                iv: user.iv
            },
            loginData: loginData,
            noteData: noteData,
            //creditData: creditData
        }

    res.status(200).send(data);
});