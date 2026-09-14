-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization
    (name, description, contact_email, logo_filename)
VALUES
    (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );

    CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL,
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);



INSERT INTO project
    (organization_id, title, description, location, date)
VALUES
    -- BrightFuture Builders (organization_id = 1)
    (1, 'Community Center Renovation',
     'Renovation of a local community center to provide a safe space for residents.',
     'Lome Community Center',
     '2026-09-20'),

    (1, 'Sustainable Housing Project',
     'Construction of affordable homes using sustainable building materials.',
     'Lome, Togo',
     '2026-10-05'),

    (1, 'School Building Improvement',
     'Improvement and repair of classrooms and school facilities.',
     'Lome Public School',
     '2026-10-15'),

    (1, 'Clean Water Facility',
     'Construction of a clean water facility for the local community.',
     'Agoe, Lome',
     '2026-10-25'),

    (1, 'Community Park Construction',
     'Development of a safe and sustainable public park.',
     'Adidogome, Lome',
     '2026-11-05'),

    -- GreenHarvest Growers (organization_id = 2)
    (2, 'Urban Garden Initiative',
     'Creation of an urban garden to provide fresh vegetables to the community.',
     'Lome Urban Garden',
     '2026-09-22'),

    (2, 'Community Farming Workshop',
     'Workshop teaching residents sustainable farming techniques.',
     'Tokoin, Lome',
     '2026-10-02'),

    (2, 'School Garden Project',
     'Creation of a vegetable garden for students to learn about agriculture.',
     'Lome Primary School',
     '2026-10-12'),

    (2, 'Tree Planting Day',
     'Community tree planting activity promoting environmental sustainability.',
     'University of Lome',
     '2026-10-20'),

    (2, 'Food Sustainability Fair',
     'Community event promoting local agriculture and sustainable food production.',
     'Lome Exhibition Center',
     '2026-11-01'),

    -- UnityServe Volunteers (organization_id = 3)
    (3, 'Neighborhood Cleanup',
     'Volunteers clean public areas and improve the local environment.',
     'Bè, Lome',
     '2026-09-25'),

    (3, 'Food Donation Drive',
     'Collection and distribution of food to families in need.',
     'Lome Community Hall',
     '2026-10-08'),

    (3, 'Elderly Support Day',
     'Volunteers provide assistance and companionship to elderly community members.',
     'Lome Senior Center',
     '2026-10-18'),

    (3, 'Youth Mentoring Program',
     'Volunteer mentoring program supporting young people in the community.',
     'Lome Youth Center',
     '2026-10-28'),

    (3, 'Community Service Day',
     'A community-wide volunteer event supporting local charities and organizations.',
     'Lome, Togo',
     '2026-11-10');

       


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (category_name)
VALUES
    ('Community Development'),
    ('Environmental Sustainability'),
    ('Education');


-- ========================================
-- Project Category Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);

-- ========================================
-- Associate Projects with Categories
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
    -- BrightFuture Builders
    (1, 1),
    (2, 1),
    (3, 3),
    (4, 1),
    (5, 1),

    -- GreenHarvest Growers
    (6, 2),
    (7, 2),
    (8, 3),
    (9, 2),
    (10, 2),

    -- UnityServe Volunteers
    (11, 1),
    (12, 1),
    (13, 1),
    (14, 3),
    (15, 1);