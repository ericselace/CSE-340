import { body, validationResult } from 'express-validator';

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import { getCategoriesByProject } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Validation rules for the new project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 999 })
        .withMessage('Project description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 199 })
        .withMessage('Project location must be less than 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be valid')
];

// Display the upcoming service projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Display the details of a single service project
const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProject(id);
    const title = project.title;

    res.render('project', { title, project, categories });
};

// Display the new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Project';

    res.render('new-project', {
        title,
        organizations
    });
};

// Process the new project form
const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);

    // Check for validation errors
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const {
        organizationId,
        title,
        description,
        location,
        date
    } = req.body;

    await createProject(
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project added successfully!');

    res.redirect('/projects');
};

// Display the edit project form
const showEditProjectForm = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();
    const title = `Edit ${project.title}`;

    res.render('edit-project', {
        title,
        project,
        organizations
    });
};

// Process the edit project form
const processEditProjectForm = async (req, res) => {
    const results = validationResult(req);

    // Check for validation errors
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const projectId = req.params.id;

    const {
        organizationId,
        title,
        description,
        location,
        date
    } = req.body;

    await updateProject(
        projectId,
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project updated successfully!');

    res.redirect(`/project/${projectId}`);
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};