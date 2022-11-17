const express = require('express')
const router = express.Router()

const authorize = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceController = require('../controllers/sauce_controller')

//GET /api/sauces
router.get('/api/sauces', authorize, sauceController.getSauces)
//GET /api/sauces/:id
router.get('/api/sauces/:id', authorize, sauceController.getSauceById)
//POST /api/sauces
router.post('/api/sauces', authorize, multer, sauceController.createSauce)
//PUT /api/sauces/:id
router.put('/api/sauces/:id', authorize, multer, sauceController.modifySauce)
//DELETE /api/sauces/:id
router.delete('/api/sauces/:id', authorize, sauceController.deleteSauce)
//POST /api/sauces/:id/like
router.post('/api/sauces/:id/like', authorize, sauceController.likeHandler)

module.exports = router