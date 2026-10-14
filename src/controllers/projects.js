import { body, validationResult } from 'express-validator';

import {
    addVolunteer,
    removeVolunteer,
    hasUserVolunteered
} from '../models/volunteers.js';

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
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        const title = 'Upcoming Service Projects';

        res.render('projects', {
            title,
            projects
        });
    } catch (error) {
        console.error('Error loading project details:', error.message);
        console.error(error.stack);

        return res.status(500).send(
            `Project details error: ${error.message}`
        );
    }
};

// Display the details of a single service project
const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;

    try {
        const project = await getProjectDetails(id);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        const categories = await getCategoriesByProject(id);

        const user = req.session?.user ?? null;
        let isVolunteer = false;

        if (user) {
            isVolunteer = await hasUserVolunteered(
                user.user_id,
                project.project_id
            );
        }

        const title = project.title;

        return res.render('project', {
            title,
            project,
            categories,
            user,
            isVolunteer
        });
    } catch (error) {
        console.error('Error loading project details:', error);
        req.flash('error', 'Unable to load project details.');
        return res.redirect('/projects');
    }
};

// Display the new project form
const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Project';

        res.render('new-project', {
            title,
            organizations
        });
    } catch (error) {
        console.error('Error loading new project form:', error);
        req.flash('error', 'Unable to load the new project form.');
        res.redirect('/projects');
    }
};

// Process the new project form
const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);

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

    try {
        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project added successfully!');
        return res.redirect('/projects');
    } catch (error) {
        console.error('Error creating project:', error);
        req.flash('error', 'Unable to create the project.');
        return res.redirect('/new-project');
    }
};

// Display the edit project form
const showEditProjectForm = async (req, res) => {
    const id = req.params.id;

    try {
        const project = await getProjectDetails(id);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        const organizations = await getAllOrganizations();
        const title = `Edit ${project.title}`;

        return res.render('edit-project', {
            title,
            project,
            organizations
        });
    } catch (error) {
        console.error('Error loading edit project form:', error);
        req.flash('error', 'Unable to load the edit project form.');
        return res.redirect('/projects');
    }
};

// Process the edit project form
const processEditProjectForm = async (req, res) => {
    const results = validationResult(req);

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

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'Unable to update the project.');
        return res.redirect(`/edit-project/${projectId}`);
    }
};

// Sign up the logged-in user as a project volunteer
const volunteerForProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        const added = await addVolunteer(
            userId,
            project.project_id
        );

        if (added) {
            req.flash(
                'success',
                'You are now volunteering for this project!'
            );
        } else {
            req.flash(
                'notice',
                'You are already volunteering for this project.'
            );
        }

        return res.redirect(`/project/${project.project_id}`);
    } catch (error) {
        console.error('Error signing up as volunteer:', error);
        req.flash('error', 'Unable to sign up. Please try again.');
        return res.redirect('/projects');
    }
};

// Remove the logged-in user from a project's volunteer list
const removeVolunteerFromProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/dashboard');
        }

        const removed = await removeVolunteer(
            userId,
            project.project_id
        );

        if (removed) {
            req.flash(
                'success',
                'You have been removed from this project.'
            );
        } else {
            req.flash(
                'notice',
                'You were not signed up for this project.'
            );
        }

        const returnToDashboard =
            req.body?.returnTo === 'dashboard';

        if (returnToDashboard) {
            return res.redirect('/dashboard');
        }

        return res.redirect(`/project/${project.project_id}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Unable to remove your volunteer signup.');
        return res.redirect('/dashboard');
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    volunteerForProject,
    removeVolunteerFromProject
};