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


let db = {};

    db.update_forgot_password_token = (id, resetToken) => {
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
        const query = `INSERT INTO reset_tokens(token, created_at, expires_at, user_id) VALUES('${resetToken}', '${createdAt}', '${expiresAt}', ${id})`;
        return client.query(query);
    };

    db.get_reset_token = (id) => {
        const query = `SELECT token, expires_at FROM reset_tokens WHERE user_id = ${id} ORDER BY created_at DESC LIMIT 1;`;
        return client.query(query);
    };

    db.update_password_reset_token = (id) => {
        const query = `DELETE FROM reset_tokens WHERE user_id = ${id}`;
        return client.query(query);
    };

    db.update_user_password = (id, password) => {
        const query = `UPDATE users SET password = '${password}' WHERE id = ${id}`;
        return client.query(query);
    };

module.exports = {
    client,
    db
};