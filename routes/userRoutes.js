const { Router } = require('express');
const userAuth = require('../controller/userAuth');
const adminAuth = require('../controller/adminAuth');
const router = Router();


// USERS.

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


// ADMIN.

    // GET.

    router.get('/admin/orders', (req, res) => res.render('admin/orders'));
    router.get('/admin/employees', adminAuth.findEmployees);
    router.get('/admin/addEmployee', (req, res) => res.render('admin/addEmployee'));
    router.get('/admin/products', (req, res) => res.render('admin/products'));
    router.get('/admin/comments', (req, res) => res.render('admin/comments'));
    router.get('/admin/stats', (req, res) => res.render('admin/stats'));

    // POST

    router.post('/admin/addEmployee', adminAuth.employeeRegister);
    router.post('/admin/employees/:id', adminAuth.deleteEmployees);


module.exports = router;