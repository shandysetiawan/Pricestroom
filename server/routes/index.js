const router = require('express').Router()
const trackRoutes = require('../routes/trackRoutes')

router.use('/', trackRoutes)

module.exports = router