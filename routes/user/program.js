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

    let sql = "SELECT * FROM programs"

    let callbacksql = "SELECT COUNT(id) AS count FROM programs"

    getData( callbacksql, (response) => cbData = response)

    conn.query(sql, (err, results) => {
        if (err)
            throw err
        else
            // console.log(cbData);
            // console.log(results);
            res.render('pages/user/programs', {
                layout: './layout/userlayout', 
                title: 'Programs',
                programs: results,
                counts: cbData
        })
    })
})


module.exports = router;
