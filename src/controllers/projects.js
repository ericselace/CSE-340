// Import any needed model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

import { getCategoriesByProject } from '../models/categories.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};