1. Npm

    `brew install npm`

2. Yarn

   `brew install yarn`

3. Express, MySQL, Cors

   `yarnpkg add express mysql cors`

4. Nodemon

   `npm install -g nodemon`

5. React.JS

    `npm install react react-dom --save`


## Running the App

### Backend

`nodemon index.js`

### Frontend

`yarnpkg start`

### adding requried modules
    run 
    `npm install` 
    in the directory of backend and frontend seperately after pulling the repository for the first time form github


### DataBase:

    Version: mysql 5.6

    User: ESMUser
    Password: ESMPassword
    Privileges: Select, Insert, Create, Update

    Databse: EmailSubscriptionManager
    table: all_links

    The DB schema is as follows:


1.  CREATE USER 'ESMUser'@'localhost' IDENTIFIED BY 'password';

2.  CREATE DATABASE EmailSubscriptionManager;

3.  USE EmailSubscriptionManager;

4.  CREATE TABLE all_links (user VARCHAR(100) NOT NULL, vendor VARCHAR(10000) NOT NULL, link VARCHAR(10000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));

5.  GRANT SELECT, INSERT, DELETE, CREATE, UPDATE ON `database`.* TO `ESMUser`@`localhost`;

Note: If you encounter the ERROR 1396 (HY000): Operation CREATE USER failed, when adding a user you have just dropped before, it is caused by a bug from MySQL. You can get around it with the following instruction:
    1.  drop user ESMUser@localhost;
    2.  flush privileges;
    3.  create user ESMUser@localhost identified by 'password'