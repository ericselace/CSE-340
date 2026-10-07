import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = async (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;

            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);

        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    req.flash('success', 'Logout successful!');

    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);
            return res.redirect('/');
        }

        res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

/**
 * Middleware factory to require a specific user role
 * @param {string} role - The required role
 * @returns {Function} Express middleware
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user has the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has the required role
        next();
    };
};

const showDashboard = async (req, res) => {
    const { name, email } = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name,
        email
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await createUser(name, email, passwordHash);

        req.flash('notice', 'Registration successful. Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);

        req.flash('notice', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
};