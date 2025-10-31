import { Module } from '../types';

export const modules: Module[] = [
  {
    id: 1,
    title: 'Welcome to Databases',
    description: 'Learn the basics of databases and create your first one',
    order: 1,
    tasks: [
      {
        id: 'task-1-1',
        module_id: 1,
        title: 'Create the Academy Database',
        description: `Welcome to The Golden Whisk Pro! You're about to become the Head Data Gastronome of our culinary academy.

Your first task is to set up the kitchen - I mean, the database!

In the database world, everything starts with creating a DATABASE. Think of it as building the entire academy building before we can add classrooms (tables) inside.

**Your Tasks:**
1. Create a database named \`golden_whisk_pro\`
2. Connect to it (we'll handle the connection part)
3. Enable the \`uuid-ossp\` extension (this will help us generate unique IDs later)`,
        expected_output: 'Database and extension created successfully',
        hints: [
          {
            level: 1,
            content: 'Databases are created using a specific SQL command. Think about what you want to CREATE and what you want to call it. Extensions are added to give your database superpowers!'
          },
          {
            level: 2,
            content: `The pattern is:
CREATE DATABASE [your_database_name];

After connecting, extensions are enabled with:
CREATE EXTENSION [extension_name];

Note: Extension names with hyphens need to be quoted.`
          },
          {
            level: 3,
            content: `CREATE DATABASE golden_whisk_pro;

-- After connecting to the database, run:
CREATE EXTENSION "uuid-ossp";`
          }
        ],
        validation: {
          type: 'extension_enabled',
          params: { extension: 'uuid-ossp' }
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Your First Table',
    description: 'Create your first database table',
    order: 2,
    tasks: [
      {
        id: 'task-2-1',
        module_id: 2,
        title: 'Create the Chefs Table',
        description: `Great! Now that we have our academy building (database), let's add our first classroom - a table to store our chefs!

Every table needs:
- A name (ours will be called \`chefs\`)
- Columns (the information we want to store)
- A primary key (a unique identifier for each row)

**Your Task:**
Create a table named \`chefs\` with these columns:
- \`id\`: UUID type, PRIMARY KEY
- \`name\`: VARCHAR(100), NOT NULL`,
        expected_output: 'Table created with correct structure',
        hints: [
          {
            level: 1,
            content: 'Tables are created with CREATE TABLE. You need to define each column with its data type and constraints. The PRIMARY KEY ensures each chef has a unique ID.'
          },
          {
            level: 2,
            content: `The structure looks like:
CREATE TABLE table_name (
    column_name data_type constraints,
    column_name data_type constraints
);

For UUID, use the UUID type. For variable-length text, use VARCHAR(length).`
          },
          {
            level: 3,
            content: `CREATE TABLE chefs (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);`
          }
        ],
        validation: {
          type: 'table_exists',
          params: {
            table: 'chefs',
            columns: ['id', 'name']
          }
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Data Type Mastery',
    description: 'Master different PostgreSQL data types',
    order: 3,
    tasks: [
      {
        id: 'task-3-1',
        module_id: 3,
        title: 'Add Bio to Chefs',
        description: `Excellent! Our chefs table exists, but it's a bit boring. Let's add more personality!

We need to add a \`bio\` column to store longer text about each chef. Unlike VARCHAR (which has a length limit), TEXT can store much longer content.

**Your Task:**
Use ALTER TABLE to add a new column:
- \`bio\`: TEXT type, can be NULL (optional)`,
        expected_output: 'Column added successfully',
        hints: [
          {
            level: 1,
            content: 'You can modify existing tables with ALTER TABLE. To add a column, use ADD COLUMN. TEXT is perfect for longer content without a specific length limit.'
          },
          {
            level: 2,
            content: `The syntax is:
ALTER TABLE table_name ADD COLUMN column_name data_type;

TEXT doesn't need a length specification. If you want it to be optional, you don't need to specify NOT NULL.`
          },
          {
            level: 3,
            content: `ALTER TABLE chefs ADD COLUMN bio TEXT;`
          }
        ],
        validation: {
          type: 'table_exists',
          params: {
            table: 'chefs',
            columns: ['id', 'name', 'bio']
          }
        }
      }
    ]
  },
  {
    id: 4,
    title: 'Custom Types & Enums',
    description: 'Create custom enumerated types',
    order: 4,
    tasks: [
      {
        id: 'task-4-1',
        module_id: 4,
        title: 'Create Course Type Enum',
        description: `Now let's get fancy! PostgreSQL allows you to create your own custom data types.

We need a type to categorize recipes by course. Instead of storing plain text (which could have typos like "Dessrt" or "dessert"), we'll create an ENUM that only allows specific values.

**Your Task:**
Create an ENUM type named \`course_type\` with these values:
- '开胃菜' (Appetizer)
- '主菜' (Main Course)
- '甜点' (Dessert)
- '汤品' (Soup)
- '饮品' (Beverage)`,
        expected_output: 'Custom type created successfully',
        hints: [
          {
            level: 1,
            content: 'ENUMs are created with CREATE TYPE ... AS ENUM. They restrict a column to only accept specific predefined values, preventing typos and ensuring data consistency.'
          },
          {
            level: 2,
            content: `The syntax is:
CREATE TYPE type_name AS ENUM ('value1', 'value2', 'value3');

Each value must be enclosed in single quotes and separated by commas.`
          },
          {
            level: 3,
            content: `CREATE TYPE course_type AS ENUM ('开胃菜', '主菜', '甜点', '汤品', '饮品');`
          }
        ],
        validation: {
          type: 'custom',
          params: {
            checkType: 'course_type'
          }
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Constraints & Integrity',
    description: 'Learn about data integrity constraints',
    order: 5,
    tasks: [
      {
        id: 'task-5-1',
        module_id: 5,
        title: 'Create Subscribers Table',
        description: `Time to build our membership system! The \`subscribers\` table will store information about members who subscribe to our academy.

This table showcases several important concepts:
- **BIGSERIAL**: Auto-incrementing integer (perfect for IDs)
- **UNIQUE**: Ensures no duplicate emails
- **DEFAULT**: Automatically sets values
- **BOOLEAN**: True/false values

**Your Task:**
Create a table named \`subscribers\` with:
- \`id\`: BIGSERIAL, PRIMARY KEY
- \`first_name\`: VARCHAR(50), NOT NULL
- \`last_name\`: VARCHAR(50), NOT NULL  
- \`email\`: VARCHAR(150), NOT NULL, UNIQUE
- \`join_date\`: TIMESTAMP, DEFAULT NOW()
- \`wants_newsletter\`: BOOLEAN, NOT NULL, DEFAULT TRUE`,
        expected_output: 'Table created with all constraints',
        hints: [
          {
            level: 1,
            content: `BIGSERIAL is a special type that auto-generates incrementing numbers. UNIQUE prevents duplicates. DEFAULT sets a value automatically if none is provided. NOW() gives the current timestamp.`
          },
          {
            level: 2,
            content: `CREATE TABLE table_name (
    id BIGSERIAL PRIMARY KEY,
    column_name type constraints,
    email type NOT NULL UNIQUE,
    date_column TIMESTAMP DEFAULT NOW(),
    boolean_column BOOLEAN NOT NULL DEFAULT TRUE
);`
          },
          {
            level: 3,
            content: `CREATE TABLE subscribers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    join_date TIMESTAMP DEFAULT NOW(),
    wants_newsletter BOOLEAN NOT NULL DEFAULT TRUE
);`
          }
        ],
        validation: {
          type: 'table_exists',
          params: {
            table: 'subscribers',
            columns: ['id', 'first_name', 'last_name', 'email', 'join_date', 'wants_newsletter']
          }
        }
      }
    ]
  },
  {
    id: 6,
    title: 'Relationships & Foreign Keys',
    description: 'Connect tables with foreign keys',
    order: 6,
    tasks: [
      {
        id: 'task-6-1',
        module_id: 6,
        title: 'Create Recipes Table',
        description: `Now for the main event - recipes! This table will be linked to our chefs table through a FOREIGN KEY relationship.

A foreign key creates a connection between tables. Each recipe will reference the chef who created it.

**Your Task:**
Create a table named \`recipes\` with:
- \`id\`: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4()
- \`title\`: VARCHAR(255), NOT NULL
- \`chef_id\`: UUID, FOREIGN KEY referencing chefs(id), ON DELETE SET NULL
- \`course\`: course_type (the ENUM we created), NOT NULL
- \`creation_date\`: DATE, NOT NULL, DEFAULT CURRENT_DATE
- \`cost_per_serving\`: NUMERIC(8, 2), CHECK (cost_per_serving > 0)`,
        expected_output: 'Table created with foreign key relationship',
        hints: [
          {
            level: 1,
            content: `uuid_generate_v4() automatically generates a new UUID. FOREIGN KEY links to another table. ON DELETE SET NULL means if a chef is deleted, their recipes stay but chef_id becomes NULL. CHECK constraints validate data.`
          },
          {
            level: 2,
            content: `CREATE TABLE table_name (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column type NOT NULL,
    foreign_column UUID REFERENCES other_table(column) ON DELETE SET NULL,
    enum_column custom_enum_type NOT NULL,
    numeric_column NUMERIC(total_digits, decimal_places) CHECK (condition)
);`
          },
          {
            level: 3,
            content: `CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    chef_id UUID REFERENCES chefs(id) ON DELETE SET NULL,
    course course_type NOT NULL,
    creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    cost_per_serving NUMERIC(8, 2) CHECK (cost_per_serving > 0)
);`
          }
        ],
        validation: {
          type: 'table_exists',
          params: {
            table: 'recipes',
            columns: ['id', 'title', 'chef_id', 'course', 'creation_date', 'cost_per_serving']
          }
        }
      }
    ]
  },
  {
    id: 7,
    title: 'JSON Magic',
    description: 'Work with semi-structured JSON data',
    order: 7,
    tasks: [
      {
        id: 'task-7-1',
        module_id: 7,
        title: 'Add Ingredients Column',
        description: `Recipes need ingredients! But each recipe has a different number of ingredients. Instead of creating a separate table, we'll use JSONB to store flexible, semi-structured data.

JSONB is PostgreSQL's binary JSON format - it's fast to query and perfect for data that doesn't fit neatly into columns.

**Your Task:**
Add an \`ingredients\` column to the recipes table:
- \`ingredients\`: JSONB type

Later, we'll store arrays of objects like:
\`[{"item": "eggs", "qty": "2"}, {"item": "flour", "qty": "1 cup"}]\``,
        expected_output: 'JSONB column added successfully',
        hints: [
          {
            level: 1,
            content: 'Use ALTER TABLE to add a new column. JSONB stores JSON data in an optimized binary format that can be indexed and queried efficiently.'
          },
          {
            level: 2,
            content: `ALTER TABLE table_name ADD COLUMN column_name JSONB;

JSONB can store objects, arrays, strings, numbers, booleans, and null.`
          },
          {
            level: 3,
            content: `ALTER TABLE recipes ADD COLUMN ingredients JSONB;`
          }
        ],
        validation: {
          type: 'table_exists',
          params: {
            table: 'recipes',
            columns: ['id', 'title', 'chef_id', 'course', 'creation_date', 'cost_per_serving', 'ingredients']
          }
        }
      }
    ]
  },
  {
    id: 8,
    title: 'Inserting Data',
    description: 'Learn to insert data into tables',
    order: 8,
    tasks: [
      {
        id: 'task-8-1',
        module_id: 8,
        title: 'Add Your First Chef',
        description: `Time to populate our database! Let's add our first chef to the academy.

When inserting data, you specify which columns to fill and their values. For UUID columns, we can either specify a UUID or let the database generate one.

**Your Task:**
Insert a chef with:
- id: '550e8400-e29b-41d4-a716-446655440001'
- name: 'Julia Child'
- bio: 'American cooking teacher and author'`,
        expected_output: 'Chef inserted successfully',
        hints: [
          {
            level: 1,
            content: 'INSERT INTO adds new rows to a table. You specify the table name, the columns in parentheses, and then the VALUES in parentheses.'
          },
          {
            level: 2,
            content: `INSERT INTO table_name (column1, column2, column3) 
VALUES ('value1', 'value2', 'value3');

Text values need single quotes. UUIDs are strings in the format 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.`
          },
          {
            level: 3,
            content: `INSERT INTO chefs (id, name, bio) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Julia Child', 'American cooking teacher and author');`
          }
        ],
        validation: {
          type: 'query_result',
          params: {
            query: "SELECT * FROM chefs WHERE name = 'Julia Child'",
            expectedCount: 1
          }
        }
      },
      {
        id: 'task-8-2',
        module_id: 8,
        title: 'Add More Chefs',
        description: `Let's add two more renowned chefs to our academy!

You can insert multiple rows in a single INSERT statement by separating each row's values with commas.

**Your Task:**
Insert these two chefs:
1. id: '550e8400-e29b-41d4-a716-446655440002', name: 'Gordon Ramsay', bio: 'British chef and TV personality'
2. id: '550e8400-e29b-41d4-a716-446655440003', name: 'Massimo Bottura', bio: 'Italian restaurateur and cookbook author'`,
        expected_output: 'Multiple chefs inserted',
        hints: [
          {
            level: 1,
            content: 'You can insert multiple rows at once by listing multiple sets of values, separated by commas.'
          },
          {
            level: 2,
            content: `INSERT INTO table_name (col1, col2, col3) 
VALUES 
    ('value1a', 'value2a', 'value3a'),
    ('value1b', 'value2b', 'value3b');`
          },
          {
            level: 3,
            content: `INSERT INTO chefs (id, name, bio) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', 'Gordon Ramsay', 'British chef and TV personality'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Massimo Bottura', 'Italian restaurateur and cookbook author');`
          }
        ],
        validation: {
          type: 'query_result',
          params: {
            query: "SELECT COUNT(*) as count FROM chefs",
            expectedCount: 3
          }
        }
      },
      {
        id: 'task-8-3',
        module_id: 8,
        title: 'Add a Recipe with JSON',
        description: `Now let's add a recipe! This will demonstrate:
- Auto-generated UUIDs
- Foreign key references
- ENUM values
- JSONB data

**Your Task:**
Insert a recipe:
- title: 'French Onion Soup'
- chef_id: '550e8400-e29b-41d4-a716-446655440001' (Julia Child)
- course: '汤品'
- cost_per_serving: 8.50
- ingredients: [{"item": "onions", "qty": "4"}, {"item": "beef broth", "qty": "6 cups"}, {"item": "cheese", "qty": "1 cup"}]

Note: Let the id and creation_date use their DEFAULT values by not specifying them!`,
        expected_output: 'Recipe with JSON inserted',
        hints: [
          {
            level: 1,
            content: `When you don't specify columns with DEFAULT values, they auto-populate. JSONB values are written as JSON strings. ENUM values must exactly match one of the defined values.`
          },
          {
            level: 2,
            content: `INSERT INTO recipes (title, chef_id, course, cost_per_serving, ingredients) 
VALUES ('Recipe Name', 'uuid-here', 'enum-value', 10.50, '[{"item": "ingredient", "qty": "amount"}]');

The ingredients must be valid JSON.`
          },
          {
            level: 3,
            content: `INSERT INTO recipes (title, chef_id, course, cost_per_serving, ingredients) 
VALUES (
    'French Onion Soup', 
    '550e8400-e29b-41d4-a716-446655440001', 
    '汤品', 
    8.50, 
    '[{"item": "onions", "qty": "4"}, {"item": "beef broth", "qty": "6 cups"}, {"item": "cheese", "qty": "1 cup"}]'
);`
          }
        ],
        validation: {
          type: 'query_result',
          params: {
            query: "SELECT * FROM recipes WHERE title = 'French Onion Soup'",
            expectedCount: 1
          }
        }
      }
    ]
  }
];

export const getModuleById = (id: number): Module | undefined => {
  return modules.find(m => m.id === id);
};

export const getTaskById = (taskId: string): Task | undefined => {
  for (const module of modules) {
    const task = module.tasks.find(t => t.id === taskId);
    if (task) return task;
  }
  return undefined;
};

