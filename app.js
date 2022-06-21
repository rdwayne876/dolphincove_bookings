require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const flash = require('express-flash');



const app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './layout/layout')
app.set('layout user', './layout/userlayout')
app.set('layout index', false)
app.set('layout make-reservation', false)
app.set('layout success', false)



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts)
app.use(session({
  secret: 'ecQJ099i5JLW15yU4lnktvrBjiPUuKeJ',
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4} //4 hours in millisecs
}))
app.use(flash())


/* -------------- Routes ------------------ */

app.use('/', require('./routes/index'))
app.use('/admin', require('./routes/admin'))
app.use('/admin/company', require('./routes/admin/company'))
app.use('/admin/users', require('./routes/admin/user'))
app.use('/admin/programs', require('./routes/admin/program'))
app.use('/admin/bookings', require('./routes/admin/booking'))
app.use('/user', require('./routes/user'))
app.use('/user/programs', require('./routes/user/program'))
app.use('/user/bookings', require('./routes/user/booking'))
app.use('/auth', require('./routes/auth'))


app.listen(process.env.PORT, 
    () => console.info( `App is listening on port ${process.env.PORT}`))
