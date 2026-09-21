// Import any needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory
} from '../models/categories.js';

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

// Export any controller functions
export { showCategoriesPage, showCategoryPage };