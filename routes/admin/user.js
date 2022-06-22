var express = require('express');
var conn = require('../../lib/db')
var router = express.Router();
const bcrypt = require('bcrypt');
const { response } = require('express');
const saltRounds = 10;

const getData= ( sql, func) => {

    conn.query(sql, (err, results) => {
        if (err)
            return func('error')
        else
            return func(results)
    })
}

router.get('/', (req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "SELECT u.id, u.f_nm, u.l_nm, u.email, c.id AS company_id, c.name AS company, ut.name AS user_type FROM users u, companies c, user_types ut WHERE u.company_id = c.id AND u.user_type = ut.id"

        /* getAggregates(function (response) {
            data = response
        }) */
        getData( 'SELECT COUNT(id) AS count FROM users', (response) => data = response)

        conn.query(sql, (err, results) => {
            if (err)
                throw err
            else
                // console.log(data);
                console.log(results);
                res.render('pages/admin/users/users', {
                    title: 'users',
                    users: results,
                    counts: data
            })
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

router.get('/add', function (req, res, next) {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "SELECT * FROM companies WHERE id != 1"

        conn.query(sql, (err, results) => {
            if (err)
                throw err
            else
                res.render('pages/admin/users/add',
                    {
                        title: 'Add New User',
                        companies: results

                    }
                )
        })
    } else{
        res.redirect('/auth/login')
        
    } 
}
);

router.post('/add', (req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        // console.log(req.body.company);
        
        bcrypt.hash('DolphinCove2022', saltRounds, (err, salt) => {

            let userType

            if( req.body.company == 2){
                userType = 1
            } else{ 
                userType = 2
            }

            let data = {
                f_nm: req.body.first_name,
                l_nm: req.body.last_name,
                email: req.body.email,
                pw: salt,
                company_id: req.body.company,
                user_type: userType
            }

            // console.log(data);

            let sql = "INSERT INTO users SET ?"

            conn.query(sql, data, (err, results) => {
                if (err)
                    throw err
                else
                    res.redirect('/admin/users')
            })
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

router.get('/edit/:id', (req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "SELECT u.id, u.f_nm, u.l_nm, u.email, c.id AS company_id, c.name AS company, ut.name AS user_type FROM users u, companies c, user_types ut WHERE u.company_id = c.id AND u.user_type = ut.id AND u.id = ?"

        let callbacksql = "SELECT * FROM companies WHERE id != 1"

        getData( callbacksql, (response) => {
            cbData = response
        })

        conn.query(sql, req.params.id, (err, results) => {
            if (err)
                throw err
            else
                console.log(results);
                res.render('pages/admin/users/edit', {
                    title: 'Edit User',
                    data: results,
                    companies: cbData
                })
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

router.post('/edit/:id', (req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        bcrypt.hash(req.body.password, saltRounds, ( err, salt) => {

            if( req.body.company == 2){
                userType = 1
            } else{ 
                userType = 2
            }

            let data = {
                f_nm: req.body.first_name,
                l_nm: req.body.last_name,
                email: req.body.email, 
                pw: salt, 
                company_id: req.body.company,
                user_type: userType
            }

            let sql = "UPDATE users SET ? WHERE users.id = ?"

            conn.query( sql, [data, req.params.id], ( err, results) => {
                if( err)  
                    throw err
                else
                    res.redirect('/admin/users')
            })
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

router.get('/delete/:id', (req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "DELETE FROM `users` WHERE `users`.`id` = ?"

        conn.query(sql, req.params.id, (err, results) => {
            if (err)
                throw err
            else
                res.redirect('/admin/users')
        })
    } else{
        res.redirect('/auth/login')
        
    } 

})

module.exports = router;
