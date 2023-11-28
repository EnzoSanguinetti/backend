
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminAuth');


router.get('/admin-panel', isAdmin, (req, res) => {

  res.render('admin-panel');
});

module.exports = router;
