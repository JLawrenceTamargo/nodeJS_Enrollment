const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const path = require('path')
const cookie = require('cookie-parser')

const hostname = 'localhost';
const port = process.env.port || 3000;
const app = express();
app.use(express.json());

dotenv.config ({path: './.env'});


//setting the handle bars and view engine template
app.set('view engine', 'hbs');

// to parse incomming request with json payloads
app.use(express.urlencoded({extended:true})); 
app.use(express.json());

//define routes
app.use('/', require('./routes/adminRoutes'));
app.use('/auth', require('./routes/adminAuth.js'))

//Cookie-Parser
app.use(cookie());

const publicDir = path.join(__dirname, './public/');
app.use(express.static(publicDir));



app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});