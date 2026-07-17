const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const client = require('../model/db');


// Generate random key.

const secretKey = crypto.randomBytes(32).toString('hex');


// Generate JWT.

function generateToken(user) {
    const payload = {
        email: user.email,
        id: user.id
    }
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}


module.exports = {
    generateToken
}