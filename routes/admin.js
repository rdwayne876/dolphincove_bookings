var express = require('express');
var conn = require('../lib/db')
var router = express.Router();

/* Companies */
router.get('/', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        res.render('pages/comingsoon', {
            title: 'Dashboard',
        })
    }
 
    res.redirect('/auth/login')
    
})

router.get('/profile', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {
 
        res.render('pages/comingsoon', {
            title: 'Profile',
        })
    
    }

    res.redirect('/auth/login')

})

module.exports = router;
