const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) //Minimum length 8
.has().uppercase() //Must have uppercase letter
.has().lowercase() //Must have lowercase letter
.has().digits(1) //Must have at least 1 digit
.has().symbols(1) //Must have at least 1 symbol
.has().not().spaces() //Should not have spaces

module.exports = passwordSchema;