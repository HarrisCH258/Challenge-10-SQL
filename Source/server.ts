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
          viewEmployees();
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
