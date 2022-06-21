var express = require('express');
var conn = require('../lib/db')
var router = express.Router();

/* Companies */
router.get('/', ( req, res) => {
 
    res.render('pages/comingsoon', {
        layout: './layout/userlayout', 
        title: 'Dashboard',
    })
})

router.get('/profile', ( req, res) => {
 
    res.render('pages/comingsoon', {
        layout: './layout/userlayout', 
        title: 'Profile',
    })
})
module.exports = router;
