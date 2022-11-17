const passwordSchema = require('../models/password_model');

//Check if password validate password schema
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ message : passwordSchema.validate(req.body.password, {list:true}) })
    } else {
        next();
    }
}