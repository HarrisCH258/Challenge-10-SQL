import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connections.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const deletedRow = 2;

pool.query(
  `DELETE FROM Department WHERE id = $1`,
  [deletedRow],
  (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`${result.rowCount} row(s) deleted!`);
  }
});

pool.query(
    `DELETE FROM Role WHERE id = $1`,
    [deletedRow],
    (err: Error, result: QueryResult) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${result.rowCount} row(s) deleted!`);
    }
  });

  pool.query(
    `DELETE FROM Employee WHERE id = $1`,
    [deletedRow],
    (err: Error, result: QueryResult) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${result.rowCount} row(s) deleted!`);
    }
  });

