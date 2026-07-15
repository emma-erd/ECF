const { Client } = require('pg');
const dotenv = require('dotenv').config();


const client = new Client ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


client.connect((err) => {
    if (err) {
        console.log("❌ Connexion failed !");
    } else {
        console.log("✨ Connected to the database !");
    }
});

module.exports = client;