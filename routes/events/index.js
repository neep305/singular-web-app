const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('events/index', { title: 'GTM Events' });
});

module.exports = router;