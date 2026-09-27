import db from './db.js'

const getAllCategories = async() => {
    const query =`
        SELECT category_id, category_name
        FROM public.category
        ORDER BY category_name;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryById = async (category_id) => {
    const query = `
        SELECT category_id, category_name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [category_id]);

    return result.rows[0];
}

const createCategory = async (category_name) => {
    const query = `
        INSERT INTO public.category (category_name)
        VALUES ($1)
        RETURNING category_id, category_name;
    `;

    const result = await db.query(query, [category_name]);

    return result.rows[0];
}
const updateCategory = async (category_id, category_name) => {
    const query = `
        UPDATE public.category
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id, category_name;
    `;

    const result = await db.query(query, [category_name, category_id]);

    return result.rows[0];
}

const getCategoriesByProject = async (project_id) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.category AS c
        INNER JOIN public.project_category AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [project_id]);

    return result.rows;
}

const getProjectsByCategory = async (category_id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id
        FROM public.project AS p
        INNER JOIN public.project_category AS pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;

    const result = await db.query(query, [category_id]);

    return result.rows;
}

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove all existing category assignments
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export { 
    getAllCategories, 
    getCategoryById, 
    createCategory,
    updateCategory,
    getCategoriesByProject,
    getProjectsByCategory,
    updateCategoryAssignments
};