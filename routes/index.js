var express = require('express');
var conn = require('../lib/db')
var router = express.Router();

const getData= ( sql, func) => {

    conn.query(sql, (err, results) => {
        if (err)
            return func('error')
        else
            return func(results)
    })
}

/* GET home page. */
router.get('/', function( req, res, next) {

    var sql = "SELECT * FROM programs"

    conn.query( sql, ( err, results) => {
        if( err)   
            throw err
        else
            // console.log(results);
            res.render( 'index', 
            {
                title: 'Welcome to Dolphin Cove', 
                layout: 'index',
                programs: results
            }
    ) 
    })
});

router.get('/make-reservation/:id', ( req, res) => {  
    
    let data = []

    let sql = 'SELECT * FROM programs WHERE id = ?'
    
    let sqlData = [
        "SELECT * FROM payment_types WHERE id != 1",
        "SELECT * FROM key_ctrl where id = 1"
    ]

    sqlData.forEach(sql => {
        getData(sql, (response) => data.push(response))
    });

    conn.query( sql, req.params.id, ( err, results) => {
        if( err)
            throw err
        else
            console.log(data);
            res.render('make-reservation', 
                {
                    title:'Make a Reservation',
                    layout: 'make-reservation',
                    program: results[0],
                    data: data
                }
            )    
    })
})

router.post('/make-reservation/:id/:inv_no', ( req, res) => {

    console.log(req.body.res_cost);
    
    let data = {
        invoice_no: req.params.inv_no,
        name: req.body.c_name,
        hotel: req.body.hotel,
        guests: req.body.guests,
        company_id: 1,
        program_id: req.params.id,
        program_date: req.body.date,
        cost: req.body.res_cost,
        payment_id: req.body.payment
    }

    console.log(data);

    let sql = "INSERT INTO bookings SET ?"

    new_inv_no = parseInt(req.params.inv_no)
    new_inv_no++

    conn.query(sql, data, (err, results) => {
        if (err)
            throw err
        else
            // console.log(new_inv_no);
            conn.query("UPDATE `key_ctrl` SET `key_value` = ? WHERE `key_ctrl`.`id` = 1", new_inv_no, ( err ) => {
                if( err)
                    throw err
            })
            res.redirect('/success',)
    })
})

router.get('/success', ( req, res) => {
    res.render( 'success', 
            {
                title: 'Welcome to Dolphin Cove', 
                layout: 'success',
            }
    ) 
})


module.exports = router;
