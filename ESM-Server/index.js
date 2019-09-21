const express = require('express'); 
const cors = require('cors') 
const mysql = require('mysql')

const app = express(); 

const SELECT_ALL_USERS_QUERY = 'SELECT * FROM users'; 

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    port: '8889',
    password: 'root', 
    database: 'EmailSubscriptionManager'
})

// Connects to the MySQL database
connection.connect(err => {
    if (err) {
        return err;  
    }
}); 

app.use(cors()); 

app.get('/', (req, res) => {
    res.send('go to /users to see a list of users')
}); 

app.get('/users/add', (req, res) => {
    const { name, age, email } = req.query; 
    // INSERT INTO `users` (`name`, `age`, `email`) VALUES ('Bruh Lee', '20', 'dklw@gmail.com')
    const INSERT_USERS_QUERY = `INSERT INTO users (name, age, email) VALUES ('${name}', ${age}, '${email}')`; 
    connection.query(INSERT_USERS_QUERY, (err, results) => {
        if (err) {
            return res.send(err); 
        } else {
            return res.send('successfully added user'); 
        }
    });
}); 

app.get('/users', (req, res) => {
    connection.query(SELECT_ALL_USERS_QUERY, (err, results) => {
        if (err) {
            return res.send(err); 
        } else {
            return res.json({
                data: results
            });
        }
    }); 
}); 

app.listen(4000, () => {
    console.log('ESM Server listening on port 4000');  
})