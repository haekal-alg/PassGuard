const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
	path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});

module.exports = {
	NODE_ENV				: process.env.NODE_ENV,
	PORT					: process.env.PORT,
	DB_HOST					: process.env.DB_HOST,
	DB_USER					: process.env.DB_USER,
	DB_DATABASE				: process.env.DB_DATABASE,
	DB_PASSWORD				: process.env.DB_PASSWORD,
	JWT_SECRET				: process.env.JWT_SECRET,
	JWT_EXPIRES_IN			: process.env.JWT_EXPIRES_IN,
	JWT_COOKIE_EXPIRES_IN	: process.env.JWT_COOKIE_EXPIRES_IN,
}