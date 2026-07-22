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


const employeeRegister = async (req, res) => {
    const {firstName, email, password} = req.body;
    
        try {
            // Verify user.
                if ( !firstName || !email || !password ) {
                    return res.status(400).json({ message: 'Please provide all required fields !'});
                }
    
                const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
                if (userExists.rows.length > 0) {
                    return res.status(400).json({ message: 'User already exists !'});       
                }
    
            // Create user with hashed password.
                const hashedPasword = await bcrypt.hash(password, 10);
    
                const newUser = await client.query(
                    'INSERT INTO users (firstName, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email', 
                    [ firstName, email, hashedPasword, "2"]
                );
    
            // Create token and cookie.
                const token = generateToken(newUser.rows[0].id);
                res.cookie('jwt', token, cookieOptions);
    
            return res.status(201).json({ user: newUser.rows[0], token });
    
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);
        }
};


const findEmployees = async (req, res) => {

    const employees = await client.query(" SELECT id, firstName, email FROM users WHERE role = '2' ") 

        if (employees.rows.length === 0) {
            //return res.status(400).json({ message: 'No data !'});
        }

        //var data = employees.rows;
        //console.log(Object.values(data || {}));

        res.render('admin/employees', {data: employees.rows });
};


const deleteEmployees = async (req, res) => {
    const id = req.params.id;

    try {
    
        const employee = await client.query(`DELETE FROM users WHERE id = ${id}`);
        //return res.status(200).json({ employee: employee.rows[0] });
        res.redirect('http://localhost:8000/admin/employees');

    } catch (error) {
        res.status(400).json({ error });
        console.log(error);
    }
};


module.exports = {
    employeeRegister,
    findEmployees,
    deleteEmployees
}