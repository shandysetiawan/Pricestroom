const router = require('express').Router()
const trackController = require('../controllers/trackController')

router.get('/tracks', trackController.fetchItems)

router.post('/tracks', trackController.addItem)

router.get('/tracks/:id', trackController.fetchItem)

router.put('/tracks/:id', trackController.updateItem)

router.delete('/tracks/:id', trackController.removeItem)

module.exports = router
