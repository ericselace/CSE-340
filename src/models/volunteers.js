import db from './db.js';

// Add a user as a volunteer for a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

// Remove a user from a project's volunteer list
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2
        RETURNING user_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

// to have all projects for which a user has volunteered
const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.location,
            project.date,
            organization.name AS organization_name
        FROM project_volunteers
        JOIN project
            ON project_volunteers.project_id = project.project_id
        JOIN organization
            ON project.organization_id = organization.organization_id
        WHERE project_volunteers.user_id = $1
        ORDER BY project.date ASC;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Check whether a user has volunteered for a specific project
const hasUserVolunteered = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rowCount > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getVolunteerProjects,
    hasUserVolunteered
};