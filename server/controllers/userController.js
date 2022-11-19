const catchAsync    = require('./../utils/catchAsync');
const AppError      = require('./../utils/appError');
const LoginInfo     = require("./../models/loginInfoModel");

/*
UNIT TEST:
1. what if the data is empty? server returns empty response
*/
const getVault = async function(user) {
    // get login info
    const loginData = await LoginInfo.findAll({
        where: { userId: user.userId },
        attributes: ["loginInfoId", "name", "username", "password"], 
        raw: true
    });

    // [TODO] get credit card
    const creditData = "";

    // [TODO] get secure note
    const noteData = "";

    data = { profile: {
                id: user.userId, 
                name: user.name, 
                email: user.email, 
                protectedKey: user.key
            },
            loginData: loginData,
            creditData: creditData,
            noteData: noteData
        }

    return data;
};

module.exports.getVault = getVault;