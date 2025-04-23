var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('sandbox', { title: 'Eardle' });
});

module.exports = router;
