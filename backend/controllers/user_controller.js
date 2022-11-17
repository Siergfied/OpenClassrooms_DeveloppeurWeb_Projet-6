const userModel = require('../models/user_model')
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt
const jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken

//Create a user account
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new userModel({
                email : req.body.email,
                password : hash
            });
        
            user.save()
                .then(() => res.status(201).json({ message : "User created !"}))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
}

//Connecting to an existing user account
exports.login = (req, res, next) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error : 'User not found !'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error : 'Incorrect password !'});
                    } else {
                        res.status(200).json({
                            userId : user._id,
                            token : jwt.sign(
                                {userId : user._id},
                                `${process.env.RND_TKN}`,
                                {algorithm : 'HS256', expiresIn : '24h' }
                            )
                        })
                    }
                })
                .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }))
}