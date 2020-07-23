const router = require('express').Router()
const trackController = require('../controllers/trackController')

router.get('/track', trackController.fetchItems)

router.post('/track', trackController.addItem)

router.get('/track/:id', trackController.fetchItem)

router.put('/track/:id', trackController.updateItem)

router.delete('/track/:id', trackController.removeItem)

module.exports = router
