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

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProject,
    getProjectsByCategory
};