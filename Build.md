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

1.  CREATE DATABASE EmailSubscriptionManager;
2.  CREATE TABLE all_links (user VARCHAR(500) NOT NULL, vendor VARCHAR(10000) NOT NULL, link VARCHAR(10000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));