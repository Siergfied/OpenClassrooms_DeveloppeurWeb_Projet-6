const sauceModel = require('../models/sauce_model');
const fileSystem = require('fs');

//Get an array of all sauces
exports.getSauces = (req, res, next) => {
    sauceModel.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

//Get a sauces by id
exports.getSauceById = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

//Create a sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;

    const sauce = new sauceModel({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
        userLiked : [],
        usersDisliked : []
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce saved !' }))
        .catch(error => res.status(400).json({ error }))
}

//Modify a sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }

    if(req.auth.userId == sauceObject.userId) {
        sauceModel.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(res.status(200).json({ message: "Sauce modifiée" }))
        .catch((error) => res.status(400).json({ error }))
    } else {
        return res.status(403)
    }
}

//Delete a sauce
exports.deleteSauce = (req, res, next) => {
    sauceModel.findOne({ _id : req.params.id })
        .then(sauce => {
            //Extract files name
            const filename = sauce.imageUrl.split('/images/')[1];
            //Deleting files
            fileSystem.unlink(`images/${filename}`, () => {
                sauceModel.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}

//Like or dislike a sauce
exports.likeHandler = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

    switch(like) {
        case 1 :
            sauceModel.updateOne(
                { _id : sauceId },
                { $push : { usersLiked : userId}, $inc : { likes : +1 }}
            )
                .then(() => res.status(200).json({ message : 'Like added !'}))
                .catch(error => res.status(400).json({ error }))
            break;

        case -1 : 
            sauceModel.updateOne(
                { _id : sauceId },
                { $push : { usersDisliked : userId}, $inc : { dislikes : +1 }}
            )
                .then(() => res.status(200).json({ message : 'Dislike added !'}))
                .catch(error => res.status(400).json({ error }))
            break;

        case 0 : 
            sauceModel.findOne({ _id : sauceId})
                .then(sauce => {
                    if(sauce.usersLiked.includes(userId)) {
                        sauceModel.updateOne(
                            { _id : sauceId},
                            { $pull : { usersLiked : userId }, $inc : { likes : -1 }}
                        )
                            .then(() => res.status(200).json({ message : 'Like removed !' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    if(sauce.usersDisliked.includes(userId)) {
                        sauceModel.updateOne(
                            { _id : sauceId},
                            { $pull : { usersDisliked : userId }, $inc : { dislikes : -1 }}
                        )
                            .then(() => res.status(200).json({ message : 'Dislike removed !' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                })
                .catch(error => res.status(404).json({ error }))
            break;
    }
}