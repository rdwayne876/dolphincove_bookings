var express = require('express');
var conn = require('../lib/db')
var router = express.Router();


router.get('/', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 2) {
 
        res.render('pages/comingsoon', {
            layout: './layout/userlayout', 
            title: 'Dashboard',
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

router.get('/profile', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 2) {
 
        res.render('pages/comingsoon', {
            layout: './layout/userlayout', 
            title: 'Profile',
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

module.exports = router;
