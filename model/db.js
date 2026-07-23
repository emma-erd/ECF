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

/*
// DATABASE SCHEMA.

CREATE TABLE IF NOT EXISTS roles (
	roleId SERIAL PRIMARY KEY NOT NULL,
	roleName VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY NOT NULL,
	firstName VARCHAR(50),
	lastName VARCHAR(50),
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	phone VARCHAR(20),
	address VARCHAR(100), 
	city VARCHAR(100),
	postCode VARCHAR(5),
	role int,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (role)
    REFERENCES roles(roleId)
);

CREATE TABLE IF NOT EXISTS reset_tokens (
	token varchar(255) PRIMARY KEY not null,
	created_at varchar(255) not null, 
	expires_at varchar(255) not null,
	user_id int not null,
	FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INT,
	order_date DATE,
	delivery_date DATE,
	delivery_time VARCHAR(50),
	menu_price VARCHAR(20),
	number_pers VARCHAR(20),
	delivery_price VARCHAR(20),
	status VARCHAR(50),
	equipment_loan BOOL,
	equipment_return BOOL,
	FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS dishes (
	id SERIAL PRIMARY KEY NOT NULL,
	dish_title VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS menus (
	id SERIAL PRIMARY KEY NOT NULL,
	title VARCHAR(50),
	dish_id INT,
	number_min_pers INT,
	price_per_pers INT,
	regime VARCHAR(50),
	description VARCHAR(250),
	quantity INT,
	FOREIGN KEY (dish_id)
    REFERENCES dishes(id)
);
*/

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