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
    processEditProjectForm,
    volunteerForProject,
    removeVolunteerFromProject
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

// ========================================
// Home
// ========================================
router.get('/', showHomePage);

// ========================================
// Organizations
// ========================================
router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// ========================================
// Projects
// ========================================
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

// Volunteer for a project — logged-in users only
router.post(
    '/project/:id/volunteer',
    requireLogin,
    volunteerForProject
);

// Remove volunteer signup — logged-in users only
router.post(
    '/project/:id/unvolunteer',
    requireLogin,
    removeVolunteerFromProject
);

// Create a project — admin only
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

// Edit a project — admin only
router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

// ========================================
// Project Categories
// ========================================
router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryPage);

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

router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// ========================================
// User Authentication
// ========================================
router.get('/register', showUserRegistrationForm);

router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);

router.post('/login', processLoginForm);

router.get('/logout', processLogout);

// ========================================
// Dashboard — logged-in users only
// ========================================
router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

// Registered users — admin only
router.get(
    '/users',
    requireRole('admin'),
    showUsers
);

// Error testing
router.get('/test-error', testErrorPage);

export default router;