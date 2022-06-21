const { response } = require('express');
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
router.get('/index', (req, res) => {

    let sql = "SELECT b.id, b.invoice_no, b.name AS cx_name, b.book_date, b.guests, b.hotel, c.name AS cmpy_name, pg.name AS prod_name, b.program_date, b.cost, py.name AS pay_type FROM bookings b, companies c, programs pg, payment_types py WHERE b.company_id = c.id AND b.program_id = pg.id AND b.payment_id = py.id AND c.id = 3;"

    let callbacksql = "SELECT COUNT(b.id) AS count FROM bookings b, companies c WHERE b.company_id = c.id AND c.id = 3"

    getData( callbacksql, (response) => cbData = response)

    conn.query(sql, (err, results) => {
        if (err)
            throw err
        else
            console.log(cbData);
            // console.log(results);
            res.render('pages/user/bookings/index', {
                layout: './layout/userlayout', 
                title: 'Bookings',
                bookings: results,
                counts: cbData[0].count
        })
    })
})

/* Add New */
router.get('/add', ( req, res) => {

    let comp_id = 3

    let sql = "SELECT * FROM key_ctrl where id = 1"

    let sqlData = [
        "SELECT id, name FROM programs",
        "SELECT * FROM payment_types"
    ]

    let data = []

    sqlData.forEach(sql => {
        getData(sql, (response) => data.push(response))
    });

    conn.query(sql, ( err, results) => {
        if( err)
            throw err
        else
            // console.log(data);
            // console.log(results);
            res.render('pages/user/bookings/add',
                {
                    layout: './layout/userlayout', 
                    title: 'Add New Booking',
                    inv_no: results[0].key_value,
                    data: data, 
                    c_id: comp_id
                }
            )
    })     
}
);

/* Submit New */
router.post('/add', (req, res) => {

    let comp_id = 3

    let data = {
        invoice_no: req.body.inv_no,
        name: req.body.c_name,
        hotel: req.body.hotel,
        guests: req.body.guest_count,
        company_id: comp_id,
        program_id: req.body.program,
        program_date: req.body.date,
        cost: req.body.cost,
        payment_id: req.body.payment
    }

    console.log(data);

    let sql = "INSERT INTO bookings SET ?"

    new_inv_no = parseInt(req.body.inv_no)
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
            res.redirect('/user/bookings/index')
    })
      
})

/* Edit a Record */
router.get('/edit/:id', (req, res) => {

    let sql = "SELECT b.*, c.name AS company_name, pg.name AS program_name, pm.name AS payment FROM bookings b, companies c, programs pg, payment_types pm WHERE b.company_id = c.id AND b.program_id = pg.id AND b.payment_id = pm.id AND b.id = ?;"

    let sqlData = [
        "SELECT id, name FROM programs",
        "SELECT * FROM payment_types"
    ]

    let data = []

    sqlData.forEach(sql => {
        getData(sql, (response) => data.push(response))
    });

    conn.query(sql, req.params.id, (err, results) => {
        if (err)
            throw err
        else
            console.log(results);
            res.render('pages/user/bookings/edit', {
                layout: './layout/userlayout', 
                title: 'Edit Booking',
                booking: results,
                data: data
            })
    })
})

router.post('/edit/:id', (req, res) => {

    comp_id = 3

    let data = {
        invoice_no: req.body.inv_no,
        name: req.body.c_name,
        hotel: req.body.hotel,
        guests: req.body.guest_count,
        company_id: 3,
        program_id: req.body.program,
        program_date: req.body.date,
        cost: req.body.cost,
        payment_id: req.body.payment
    }

    let sql = "UPDATE bookings SET ? WHERE bookings.id = ?"

    conn.query( sql, [data, req.params.id], ( err, results) => {
        if( err)  
            throw err
        else
            res.redirect('/user/bookings/index')
    })
    
})

/* View Invoice */

router.get( '/invoice/:id', ( req, res) => {

    let sql = "SELECT b.*, c.name AS company_name, pg.name AS program_name, pm.name AS payment FROM bookings b, companies c, programs pg, payment_types pm WHERE b.company_id = c.id AND b.program_id = pg.id AND b.payment_id = pm.id AND b.id = ?;"

    conn.query( sql, req.params.id, ( err, results) => {
        if( err)
            throw err
        else    
            console.log(results);
            res.render('pages/invoice', {
                title: 'View Invoice',
                data: results
            })
    })

})

module.exports = router;