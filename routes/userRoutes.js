const { Router } = require('express');
const userAuth = require('../controller/userAuth');
const { requireAuth } = require('../middleware/jwt');
const router = Router();


// GET.

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/forgot', (req, res) => res.render('forgot'));
router.get('/reset/token/:token', (req, res) => res.render('reset'));
router.get('/user', (req, res) => res.render('user'));
router.get('/logout', userAuth.Logout);


// POST.

router.post('/login', userAuth.Login);
router.post('/register', userAuth.Register);
router.post('/forgot', userAuth.Forgot);


// PATCH.

router.patch('/reset/token/:token', userAuth.Reset);


module.exports = router;