const express = require('express');
const client = require('../model/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/jwt');


const cookieOptions = {
    httpOnly : true,
    secure: process.env.NODE_ENV === 'production',
    samesite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000     // 1 day.
};


const Login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Verify user.
            if ( !email || !password ) {
                return res.status(400).json({ message: 'Please provide all required fields !'});
            };

        // Find user.
            const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

            if (user.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid email !'});
            };

        // Verify credentials match.
            const userData = user.rows[0];
            const isMatch = await bcrypt.compare(password, userData.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password !'})
            };

        // Create token and cookie.
            const token = generateToken(userData.id);
            res.cookie('jwt', token, cookieOptions);

        return res.status(200).json({ user: { id: userData.id, firstName: userData.firstName, email: userData.email } });

    } catch (error) {
        res.status(400).json({ error });
        console.log(error)
    }
}


const Register = async (req, res) => {
    const {firstName, lastName, email, password, phone, postCode, address, city} = req.body;

    try {
        // Verify user.
            if (!firstName || !lastName || !email || !password || !phone || !address || !city || !postCode) {
                return res.status(400).json({ message: 'Please provide all required fields !'});
            }

            const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);

            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists !'});       
            }

        // Create user with hashed password.
            const hashedPasword = await bcrypt.hash(password, 10);

            const newUser = await client.query(
                'INSERT INTO users (firstName, lastName, email, password, phone, address, city, postCode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, firstName, email', 
                [firstName, lastName, email, hashedPasword, phone, address, city, postCode]
            );

        // Create token and cookie.
            const token = generateToken(newUser.rows[0].id);
            res.cookie('jwt', token, cookieOptions);

        return res.status(201).json({ user: newUser.rows[0], token });

    } catch (error) {
        res.status(400).json({ error });
        console.log(error);
    }
}


const Forgot = async (req, res) => {

    try {
        
    } catch (error) {
        
    }
}


const Reset = async (req, res) => {

    try {
        
    } catch (error) {
        
    }
}


const Logout = async (req, res) => {
    res.cookie('jwt', '', { ...cookieOptions, maxAge: 1 });
    res.json({ message: 'Logged out successfully ! '});
};


module.exports = {
    Login,
    Register,
    Forgot,
    Reset,
    Logout
};