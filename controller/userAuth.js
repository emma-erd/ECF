const express = require('express');
const {client , db} = require('../model/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateToken} = require('../middleware/jwt');
const sendEmail = require('../middleware/email');


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
};


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
};


const Forgot = async (req, res) => {
    const { email } = req.body;

    try {
        // Verify user.
        if ( !email ) {
            return res.status(400).json({ message: 'Please provide all required fields !'});
        };

        // Find user.
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email !'});
        };

        // Create token.
        const userData = user.rows[0];
        const token = crypto.randomBytes(20).toString("hex");
        const resetToken = crypto.createHash("sha256").update(token).digest("hex");

        await db.update_forgot_password_token(userData.id, resetToken);

        // Send email.
        const resetURL = `${process.env.CLIENT_URL}/reset/token/${resetToken}`;
        const html = `<html>
                            <head>
                                <title>Password Reset Request</title>
                                    </head>
                                        <body>
                                            <h1>Password Reset Request</h1>
                                                <p>Dear ${userData.email},</p>
                                                <p>Nous avons reçu une requête de réinitialisation de mot de passe pour votre compte chez Vite&Gourmand. Pour achever le processus, cliquer sur le bouton ci-dessous:</p>
                                                <a href=${resetURL}><button style="background-color: #d4886f; color: #FFFFFF; padding: 14px 20px; border: none; cursor: pointer; border-radius: 10px;">Réinitialisez votre mot de passe</button></a>
                                                <p>Notez que ce lien n'est valide que pour une durée de 5 mins. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
                                                <p>L'équipe Vite&Gourmand.</p>
                                        </body>
                                </html>`;
        
        await sendEmail({ email: userData.email, subject: 'Reset your Password !', html });
        res.status(200).json({status : 'success', message : resetToken });

    } catch (error) {
        res.status(400).send({ error });
        console.log(error);
    }
};


const Reset = async (req, res) => {

    const { email, password } = req.body;
    const hashedToken = req.params.token;

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

        // Get the userToken.
        const userData = user.rows[0];
        const token = await client.query(`SELECT token FROM reset_tokens WHERE user_id = $1`, [userData.id]);
        
            for (var [key, value] of Object.entries(token.rows[0])) {
                console.log(`${key} and ${value}`);
                var userToken = value;
            }

            if (!res || res.length === 0) {
                return res.status(404).json({ message: 'Some problem occured !'});
            } 
            
        // Verify userToken.
        const currDateTime = new Date();
        const tokenExpires = await client.query(`SELECT expires_at FROM reset_tokens WHERE user_id = $1`, [userData.id]);
        const expiresAt = new Date(tokenExpires.rows[0]);

            if (currDateTime > expiresAt) {
                return res.status(404).json({ message: 'Reset password link expired !'});
            } 
            
            if (userToken !== hashedToken) {
                return res.status(404).json({ message: `Reset password link is invalid ! userToken: ${userToken} and hashedToken: ${hashedToken}`});
            } 

        // Delete userToken in the database.
        await db.update_password_reset_token(userData.id);

        // Store new password in the database.
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update_user_password(userData.id, hashedPassword);

        res.status(200).json({ message: 'Your password reset is successfull !'});

    } catch (error) {
        res.status(400).send({ error });
        console.log(error);
    }
};


const Logout = async (req, res) => {
    res.cookie('jwt', '', { ...cookieOptions, maxAge: 1 });
    res.redirect("/home");
};


module.exports = {
    Login,
    Register,
    Forgot,
    Reset,
    Logout
};