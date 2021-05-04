const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: "App'Iness's Rest API" });
});

module.exports = router;