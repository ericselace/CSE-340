import express from 'express';

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
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
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

router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/categories', showCategoriesPage);

// Category details page

router.get('/category/:id', showCategoryPage);

// Project details page

router.get('/project/:id', showProjectDetailsPage);

// Assign categories to project

router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

// Organization details page

router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page

router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

// Error-handling routes

router.get('/test-error', testErrorPage);

// Route to display the edit organization form

router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

export default router;