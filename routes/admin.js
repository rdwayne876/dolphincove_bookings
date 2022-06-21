var express = require('express');
var conn = require('../lib/db')
var router = express.Router();

/* Companies */
router.get('/', ( req, res) => {
 
    res.render('pages/comingsoon', {
        title: 'Dashboard',
    })
})

router.get('/profile', ( req, res) => {
 
    res.render('pages/comingsoon', {
        title: 'Profile',
    })
})
module.exports = router;
