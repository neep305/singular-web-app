const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('bridge/index', { title: 'Bridge | Singular' });
});

module.exports = router;