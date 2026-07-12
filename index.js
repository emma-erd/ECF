const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const client = require('./model/db');
const usersRoutes = require('./routes/userRoutes');
const app = express();


// Middleware.

app.use(bodyParser.json({type: 'application/*+json'}));
app.use(express.static('public'));


// View engine.
    
app.set('view engine', 'ejs');


// Server connection.

app.listen(8000, () => {
    console.log(`✨ Server is running on port : 8000`);
});


// Routes.

app.get('/home', (req, res) => res.render('home'));

app.use(usersRoutes);