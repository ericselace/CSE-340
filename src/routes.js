import express from 'express';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
} from './controllers/users.js';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationDetailsPage,
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    organizationValidation,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm,
    showCategoryPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

// Route to display the new project form
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

// Route to handle new project form submission
router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get('/categories', showCategoriesPage);

// Route to display the new category form
router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

// Route to handle the new category form submission
router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

// Route to display the edit category form
router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

// Route to handle the edit category form submission
router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// Category details page
router.get('/category/:id', showCategoryPage);

// Project details page
router.get('/project/:id', showProjectDetailsPage);

// Assign categories to project
router.get(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    processAssignCategoriesForm
);

// Route to display the edit project form
router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

// Route to handle the edit project form submission
router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

// Organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

// Route to handle new organization form submission
router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

// Route to display the edit organization form
router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

// Route to handle the edit organization form submission
router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// Error-handling routes
router.get('/test-error', testErrorPage);

router.get('/register', showUserRegistrationForm);

router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);

router.post('/login', processLoginForm);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
// Protected users page — admin only
router.get(
    '/users',
    requireRole('admin'),
    showUsers
);

router.get('/logout', processLogout);

export default router;