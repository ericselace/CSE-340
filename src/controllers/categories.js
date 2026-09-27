import { body, validationResult } from 'express-validator';

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getProjectsByCategory,
    getCategoriesByProject,
    updateCategoryAssignments

} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Create New Category';

    res.render('new-category', {
        title
    });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const title = 'Create New Category';

        return res.render('new-category', {
            title,
            errors: errors.array(),
            category_name: req.body.category_name
        });
    }

    const { category_name } = req.body;

    const category = await createCategory(category_name);

    req.flash(
        'success',
        'Category created successfully.'
    );

    res.redirect(`/category/${category.category_id}`);
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
const showEditCategoryForm = async (req, res) => {
    const category_id = req.params.id;

    const category = await getCategoryById(category_id);

    const title = 'Edit Category';

    res.render('edit-category', {
        title,
        category
    });
};
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    const category_id = req.params.id;

    if (!errors.isEmpty()) {
        const title = 'Edit Category';

        return res.render('edit-category', {
            title,
            category: {
                category_id,
                category_name: req.body.category_name
            },
            errors: errors.array()
        });
    }

    const { category_name } = req.body;

    await updateCategory(category_id, category_name);

    req.flash(
        'success',
        'Category updated successfully.'
    );

    res.redirect(`/category/${category_id}`);
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

export {
    showCategoriesPage,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm,
    showCategoryPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};