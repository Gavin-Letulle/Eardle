var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('classic', { title: 'Eardle' });
});

module.exports = router;
