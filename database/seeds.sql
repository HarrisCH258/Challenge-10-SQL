Insert Into Department (name)
VALUES ('Produce'),
         ('Meat'),
         ('Dairy');

Insert Into Role (title, salary, department_id)
VALUES ('Cashier', 10.00, 1),
       ('Stock Clerk', 12.00, 1),
       ('Assistant Manager', 15.00, 1),
       ('Butcher', 15.00, 2),
       ('Assistant Butcher', 12.00, 2),
       ('Dairy Clerk', 12.00, 3),
       ('Assistant Dairy Clerk', 10.00, 3);


Insert Into Employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 3),
       ('Jane', 'Doe', 2, 3),
       ('Jim', 'Doe', 3, 3),
       ('Jack', 'Doe', 4, 6),
       ('Jill', 'Doe', 5, 6),
       ('Joe', 'Doe', 6, 9),
       ('Jenny', 'Doe', 7, 9);
    
