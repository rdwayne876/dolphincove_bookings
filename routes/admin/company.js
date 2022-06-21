var express = require('express');
var conn = require('../../lib/db')
var router = express.Router();

function getAggregates( func) {
    let sql = "SELECT COUNT(id) AS count FROM companies WHERE id != 1 AND id != 2"

    conn.query(sql, ( err, results) => {
        if(err)
            return func('error')
        else
            return func(results)
    })
}

router.get('/', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "SELECT * FROM companies WHERE id != 1 AND id != 2"

        getAggregates(function (response){
            data = response
        })

        conn.query( sql, ( err, results) => {
            if( err)
                throw err
            else   
            // console.log(data);
                // console.log(results);
                res.render('pages/admin/company/companies', {
                    title: 'Companies',
                    companies: results,
                    counts: data
                })
        })
    }

    res.redirect('/auth/login')

})

router.get('/add', function( req, res, next) {

    if( req.session.loggedin == true && req.session.userType == 1) {

        res.render( 'pages/admin/company/add', 
            {
                title: 'Add New Company', 

            }
        ) 
    }

    res.redirect('/auth/login')

    }
);

router.post('/add', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let data = {
            name: req.body.name
        }
        
        let sql = "INSERT INTO companies SET ?"

        conn.query( sql, data, ( err, results) => {
            if( err)
                throw err
            else
                res.redirect('/admin/company')
        })
    }

    res.redirect('/auth/login')

})

router.get('/edit/:id', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "SELECT * FROM companies WHERE id = ?"

        conn.query( sql, req.params.id, ( err, results) =>{
            if( err)
                throw err
            else
                // console.log(results);
                res.render('pages/admin/company/edit', {
                    title: 'Edit Company',
                    data: results
                })
        })
    }

    res.redirect('/auth/login')
    
})

router.post('/edit/:id', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        // console.log(req.body.name, req.params.id);
        let sql = `UPDATE companies SET name =? WHERE companies.id = ?`

        conn.query( sql, [req.body.name, req.params.id], ( err, results) => {
            if( err)
                throw err
            else
                res.redirect('/admin/company')
        })
    }

    res.redirect('/auth/login')

})

router.get('/delete/:id', ( req, res) => {

    if( req.session.loggedin == true && req.session.userType == 1) {

        let sql = "DELETE FROM `companies` WHERE `companies`.`id` = ?"

        conn.query( sql, req.params.id, ( err, results) => {
            if( err)
                throw err
            else
                res.redirect('/admin/company')
        })
    }
    
    res.redirect('/auth/login')

})

module.exports = router;
