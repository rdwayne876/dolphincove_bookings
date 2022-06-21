var express = require('express');
var conn = require('../../lib/db')
var router = express.Router();

const getData= ( sql, func) => {

    conn.query(sql, (err, results) => {
        if (err)
            return func('error')
        else
            return func(results)
    })
}

/* Index  */
router.get('/', (req, res) => {

    let sql = "SELECT * FROM programs"

    let callbacksql = "SELECT COUNT(id) AS count FROM programs"

    getData( callbacksql, (response) => cbData = response)

    conn.query(sql, (err, results) => {
        if (err)
            throw err
        else
            // console.log(cbData);
            // console.log(results);
            res.render('pages/admin/programs/programs', {
                title: 'Programs',
                programs: results,
                counts: cbData
        })
    })
})

/* Add New */
router.get('/add', ( req, res) => {
    
    res.render('pages/admin/programs/add',
        {
            title: 'Add New Program',
        }
    )
}
);

router.post('/add', (req, res) => {

    let data = {
        name: req.body.name,
        description: req.body.description,
        photo: req.body.photo,
        price: req.body.price
    }

    console.log(data);

    let sql = "INSERT INTO programs SET ?"

    conn.query(sql, data, (err, results) => {
        if (err)
            throw err
        else
            res.redirect('/admin/programs')
    })
      
})

router.get('/edit/:id', (req, res) => {

    let sql = "SELECT * FROM programs WHERE id = ?"

    conn.query(sql, req.params.id, (err, results) => {
        if (err)
            throw err
        else
            console.log(results);
            res.render('pages/admin/programs/edit', {
                title: 'Edit User',
                data: results
            })
    })
})

router.post('/edit/:id', (req, res) => {

    let data = {
        name: req.body.name,
        description: req.body.description,
        photo: req.body.photo,
        price: req.body.price
    }

    let sql = "UPDATE programs SET ? WHERE programs.id = ?"

    conn.query( sql, [data, req.params.id], ( err, results) => {
        if( err)  
            throw err
        else
            res.redirect('/admin/programs')
    })
    
})

router.get('/delete/:id', (req, res) => {

    let sql = "DELETE FROM `programs` WHERE `programs`.`id` = ?"

    conn.query(sql, req.params.id, (err, results) => {
        if (err)
            throw err
        else
            res.redirect('/admin/programs')
    })
})

module.exports = router;
