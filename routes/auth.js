var express = require('express');
var conn = require('../lib/db')
var router = express.Router();
const bcrypt = require('bcrypt')

/* Companies */
router.get('/login', ( req, res) => {
 
    res.render('login', {
        layout: 'login.ejs', 
        title: 'Log In',
    })
})

router.post('/login', ( req, res) => {

    let data = {
        email: req.body.email,
        pw: req.body.password
    }

    sql = "SELECT * FROM users WHERE email = ?"

    conn.query( sql, data.email, ( err, results) => {
        if( err)
            throw err
        else
            if( results.length <= 0) {
                req.flash('error', 'Invalid credentials Please try again!')
                res.redirect('/auth/login')
            } else {

                bcrypt.compare(data.pw, results[0].pw, (err, resp) => {
                    // console.log('Compared result', res) 
                    if( resp == false){
                        req.flash('error', 'Invalid credentials Please try again!')
                        res.redirect('/auth/login')
                    } else{
                        req.session.loggedin = true;
                        req.session.companyId = results[0].company_id;
                        req.session.userType = results[0].user_type;

                        if( req.session.userType == 1){
                            res.redirect('/admin/company')
                        }
                        if( req.session.userType == 2){
                            res.redirect('/user/programs/index')
                        }
                    }                    
                })
            }    
    })
})

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
  });

module.exports = router;
