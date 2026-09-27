// Import any needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    getCategoriesByProject,
    updateCategoryAssignments
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryPage = async (req, res) => {
    const category_id = req.params.id;

    const category = await getCategoryById(category_id);
    const projects = await getProjectsByCategory(category_id);

    const title = category.category_name;

    res.render('category', {
        title,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        project,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    let categoryIds = req.body.categoryIds;

    if (!categoryIds) {
        categoryIds = [];
    }

    if (!Array.isArray(categoryIds)) {
        categoryIds = [categoryIds];
    }

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash(
        'success',
        'Project categories updated successfully.'
    );

    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};