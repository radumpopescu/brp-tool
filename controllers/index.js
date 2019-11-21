const express = require('express')
const router = express.Router()

router.use('/scrapes', require('./scrapes'))
router.use('/files', require('./files'))

module.exports = router
