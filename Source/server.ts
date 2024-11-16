import express from 'express';
import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connections.js';
import dotenv from 'dotenv';
import Table from 'cli-table3';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startInquirer = async () => {
  try {
    await connectToDb();
    inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'view all departments',
          'view all roles',
          'view all employees',
          'add a department',
          'add a role',
          'add an employee',
          'update employee role',
          'Exit',
        ],
      }
    ]).then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartment();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addaEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit(0);
      }
    });
  } catch (err) {
    console.error('Error starting inquirer:', err);
  }
};
const viewEmployees = async () => {
  try {
    const res: QueryResult = await pool.query('SELECT Employee.id AS "ID", Employee.first_name AS "First Name", Employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", roles.salary AS "Salary", CONCAT(manager.first_name, \' \', manager.last_name) AS "Manager" FROM Employee LEFT JOIN roles ON Employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN Employee managers ON Employee.manager_id = managers.id');
    const table = new Table({
      head: ['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
      colWidths: [5, 12, 12, 12, 12, 12, 12],
    });
    res.rows.forEach((row) => {
      table.push([row['ID'], row['First Name'], row['Last Name'], row['Job Title'], row['Department'], row['Salary'], row['Manager']]);
    });
    console.log(table.toString());
  }
  catch (err) {
    console.error('Error viewing employees:', err);
  } finally {
    startInquirer();
  }
};
const viewRoles = async () => {
  try {
    const res: QueryResult = await pool.query('SELECT Role.id AS "ID", Role.title AS "Title", Role.salary AS "Salary", Department.name AS "Department" FROM roles LEFT JOIN Department ON Role.department_id = Department.id');
    const table = new Table({
      head: ['ID', 'Title', 'Salary', 'Department'],
      colWidths: [5, 12, 12, 12],
    });
    res.rows.forEach((row) => {
      table.push([row['ID'], row['Title'], row['Salary'], row['Department']]);
    });
    console.log(table.toString());
  }
  catch (err) {
    console.error('Error viewing roles:', err);
  } finally {
    startInquirer();
  }
};
const viewDepartment = async () => {
  try {
    const res: QueryResult = await pool.query('SELECT id AS "ID", name AS "Department" FROM Department');
    const table = new Table({
      head: ['ID', 'Department'],
      colWidths: [5, 12],
    });
    res.rows.forEach((row) => {
      table.push([row['ID'], row['Department']]);
    });
    console.log(table.toString());
  }
  catch (err) {
    console.error('Error viewing departments:', err);
  } finally {
    startInquirer();
  }
};

const addDepartment = async () => {
  try {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      }
    ]);
    await pool.query('INSERT INTO Department (name) VALUES ($1)', [res.name]);
    console.log("(/'_'/)");
  } catch (err) {
    console.error('Error adding department:', err);
  } finally {
    startInquirer();
  }
};
const addRole = async () => {
  try {
    const departments = await pool.query('SELECT * FROM Department');

    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'enter the salary of the role:',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select the department for the role:',
        choices: departments.rows.map((department) => ({
          name: department.name,
          value: department.id
        })),
        },
    ]);
    await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [res.title, res.salary, res.department]);
    console.log("(/'_'/)");
  } catch (err) {
    console.error('Error adding role:', err);
  } finally {
    startInquirer();
  }
};

const addaEmployee = async () => {
  try {
    const roles = await pool.query('SELECT * FROM Role');
    const employees = await pool.query('SELECT * FROM Employee');

    const employee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the employees\'s last name:',
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select the employee\'s role:',
        choices: roles.rows.map((role) => ({
          name: role.title,
          value: role.id
        })),
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Select the employee\'s manager:',
        choices: employees.rows.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        })),
      },
    ]);

    await pool.query('INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [employee.first_name, employee.last_name, employee.role, employee.manager]);

    console.log("(/'_'/)");
  } catch (err) {
    console.error('Error adding employee:', err);
  } finally {
    startInquirer();
  }
};

const updateEmployeeRole = async () => {
  try {
    const employees = await pool.query('SELECT * FROM Employee');
    const roles = await pool.query('SELECT * FROM roles');

    const employee = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select the employee to update:',
        choices: employees.rows.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        })),
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select the employee\'s new role:',
        choices: roles.rows.map((role) => ({
          name: role.title,
          value: role.id
        })),
      },
    ]);

    await pool.query('UPDATE Employee SET role_id = $1 WHERE id = $2', [employee.role, employee.employee]);

    console.log("(/'_'/)");
  } catch (err) {
    console.error('Error updating employee role:', err);
  } finally {
    startInquirer();
  }
};

app.use((_req, res) => {
  res.status(404).end('404: Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://Localhost:${PORT}`);
});

startInquirer();

  