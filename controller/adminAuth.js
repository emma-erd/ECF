const express = require('express');
const {client} = require('../model/db');
const bcrypt = require('bcrypt');
const { generateToken} = require('../middleware/jwt');



const cookieOptions = {
    httpOnly : true,
    secure: process.env.NODE_ENV === 'production',
    samesite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000     // 1 day.
};


const adminRegister = async (req, res) => {
    try {
        // Create user with hashed password.
            const hashedPasword = await bcrypt.hash("admin", 10);
    
            const admin = await client.query(
                'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email', 
                ['admin@gmail.com', hashedPasword, '1']
            );
        
        // Create token and cookie.
            const token = generateToken(admin.rows[0].id);
            res.cookie('jwt', token, cookieOptions);
        
        return res.status(201).json({ user: admin.rows[0], token });
        
    } catch (error) {
        console.log(error);
    }
}

// adminRegister();
