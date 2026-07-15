const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const client = require('./model/db');
const usersRoutes = require('./routes/userRoutes');
const app = express();


// Middleware.

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


// View engine.
    
app.set('view engine', 'ejs');


// Server connection.

app.listen(8000, () => {
    console.log(`✨ Server is running on port : 8000`);
});


// Routes.

app.get('/home', (req, res) => res.render('home'));

app.use(usersRoutes);