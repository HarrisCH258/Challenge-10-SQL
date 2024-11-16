import express from 'express';
import { pool, connectToDb } from './connections.js';
await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const deletedRow = 2;
pool.query(`DELETE FROM Department WHERE id = $1`, [deletedRow], (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`${result.rowCount} row(s) deleted!`);
    }
});
pool.query(`DELETE FROM Role WHERE id = $1`, [deletedRow], (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`${result.rowCount} row(s) deleted!`);
    }
});
pool.query(`DELETE FROM Employee WHERE id = $1`, [deletedRow], (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`${result.rowCount} row(s) deleted!`);
    }
});
pool.query('SELECT * FROM Department', (err, result) => {
    if (err) {
        console.log(err);
    }
    else if (result) {
        console.log(result.rows);
    }
});
pool.query('SELECT * FROM Role', (err, result) => {
    if (err) {
        console.log(err);
    }
    else if (result) {
        console.log(result.rows);
    }
});
pool.query('SELECT * FROM Employee', (err, result) => {
    if (err) {
        console.log(err);
    }
    else if (result) {
        console.log(result.rows);
    }
});
app.use((_req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
