import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import { getVolunteerProjects } from '../models/volunteers.js';

// Display the user registration form
const showUserRegistrationForm = async (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

// Display the login form
const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

// Process user login
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;

        req.flash('success', 'Login successful!');

        if (res.locals.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }

        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);

        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );

        return res.redirect('/login');
    }
};

// Process user logout
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/login');
    }

    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);
            return res.redirect('/');
        }

        res.redirect('/login');
    });
};

// Require an authenticated user
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

// Require a specific user role
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access this page.'
            );

            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access this page.'
            );

            return res.redirect('/');
        }

        next();
    };
};

// Display the dashboard and the user's volunteer projects
const showDashboard = async (req, res) => {
    try {
        const {
            user_id,
            name,
            email,
            role_name
        } = req.session.user;

        const volunteerProjects = await getVolunteerProjects(user_id);

        res.render('dashboard', {
            title: 'Dashboard',
            name,
            email,
            user: {
                user_id,
                name,
                email,
                role_name
            },
            volunteerProjects
        });
    } catch (error) {
        console.error('Error loading dashboard:', error.message);
        console.error(error.stack);

        return res.status(500).send(
            `Dashboard error: ${error.message}`
        );
    }
};

// Display the registered users list (admin only through the route)
const showUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users
        });
    } catch (error) {
        console.error('Error retrieving users:', error);

        req.flash('error', 'Unable to retrieve the users list.');
        return res.redirect('/dashboard');
    }
};

// Process user registration
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await createUser(name, email, passwordHash);

        req.flash('notice', 'Registration successful. Please log in.');

        return res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);

        req.flash(
            'error',
            'Registration failed. Please check your information and try again.'
        );

        return res.redirect('/register');
    }
};

// Export controller functions
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
};