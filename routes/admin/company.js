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
})

router.get('/add', function( req, res, next) {

        res.render( 'pages/admin/company/add', 
            {
                title: 'Add New Company', 

            }
        ) 
    }
);

router.post('/add', ( req, res) => {

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
})

router.get('/edit/:id', ( req, res) => {
    
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
})

router.post('/edit/:id', ( req, res) => {

    // console.log(req.body.name, req.params.id);
    let sql = `UPDATE companies SET name =? WHERE companies.id = ?`

    conn.query( sql, [req.body.name, req.params.id], ( err, results) => {
        if( err)
            throw err
        else
            res.redirect('/admin/company')
    })
})

router.get('/delete/:id', ( req, res) => {

    let sql = "DELETE FROM `companies` WHERE `companies`.`id` = ?"

    conn.query( sql, req.params.id, ( err, results) => {
        if( err)
            throw err
        else
            res.redirect('/admin/company')
    })
})

module.exports = router;
