const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

dotenv.config({ path: './config/config.env' })


// passing passport from here to ./config/passport.js
require('./config/passport')(passport)

// connection to moongose is initialized
connectDB()

const app = express()

// These are express middleware to recognize incoming data from server as strings,arrays, or json 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// these are handlebar helpers.These are useful to pass functions to .hbs files in views folder
const { formatDate, truncate , stripTags, editIcon, select } = require('./helpers/hbs')


app.engine('.hbs', exphbs({ helpers: 
                             { formatDate ,
                                stripTags,
                                truncate,
                                editIcon,
                                select
                            },
                            defaultLayout: 'main',
                             extname: '.hbs'}));
app.set('view engine', '.hbs');


//express-session middleware
//we store the session in the database (not in the localstorage) so we use store below
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//we make user local to available throughout the session
app.use(function (req,res,next){
    res.locals.user = req.user || null
    next()
})

//for put and delete methods of form
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const PORT = process.env.PORT || 5000;




app.listen(PORT,console.log(`server running on port ${PORT}`))
