const jwt = require('jsonwebtoken');
const crypto = require('crypto');


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


const protected = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token !' });
        } 

        const decoded = jwt.verify(token, secretKey);
        const user = await client.query('SELECT id, firstname, email FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Not authorized, user not found !' });
        };

        req.user = user.rows[0];
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not auhtorized, token failed !' });
    }
}


module.exports = {
    generateToken,
    protected,
}