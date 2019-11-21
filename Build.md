# Pre-Installation
Email Subscription Manager can run either using [node.js](https://nodejs.org/en/) or Homebrew. Depending on your choice, please ensure you have either one installed.

## node.js
Check if your machine has node.js installed. You can check by opening up command line (for Windows) or terminal (for Mac).
1. Check **node.js**
```
node -v
```
2. Check **npm**
```
npm -v
```

## Homebrew
1.

# Dependencies
If you have node.js installed skip to step 6.

1. Install **npm**

   ```
   brew install npm
   ```

2. Install **Yarn**

   ```
   brew install yarn
   ```

3. Install **Express**, **MySQL**, **Cors**

   ```
   yarnpkg add express mysql cors
   ```

4. Install **Nodemon**, used to run the Express app

   ```
   npm install -g nodemon
   ```

5. Install **React**

   ```
   npm install react react-dom --save
   ```

6. Change directory to the backend and npm install

   ```
   cd ESM-Server
   npm install
   ```

7. Change direcotry to the frontend and npm install

   ```
   cd esm-app
   npm install
   ```

8. **Set up MySQL Database**:

   Please install MAMP (for Mac) or WAMP (for windows), or any MySQL server.

   Set up the **database schema**:

   ```sql
   CREATE DATABASE EmailSubscriptionManager;
   ```

   ```sql
   CREATE TABLE all_links (user VARCHAR(500) NOT NULL, vendor VARCHAR(10000) NOT NULL, link VARCHAR(10000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));
   ```

   Set up the **database user**:

   ```mysql
   SET PASSWORD for 'ESMUser'@'localhost' = 'ESMPassword'
   ```

   Give the user right **privileges**:

   Go to the database(EmailSubscriptionManager) we just created, click **Privileges** on the navigation bar, click **Edit Privileges** under **Action** for **ESMUser**, and grant it all privileges.

# Build

### Database

Make sure that you have the MySQL database running. It is currently set up in the backend that it will try to connect to MySQL server at port 8889 if you are using a Mac OS, or port 3306 if you are using a Windows OS, which are usually the default ports for the two different systems. If your MySQL database runs on a different port or you would like to select your own port, please go to ESM-Server/index.js and overwrite lines 19-21 to:
```javascript
var DBPORT = INSERT YOUR MYSQL PORT HERE;
```

### Starting Backend Server

Start terminal and change directory to the backend. Then start the server.
```
cd ESM-Server
node index.js
```
Backend server should be running at: http://localhost:4000/

### Starting the Email Subscription Manager

Start a new terminal, change directory to the frontend.

```
cd esm-app
npm start
```

A new window on your default browser should pop up. If this does not occur please, open any web browser and visit http://localhost:3000/

## Contact


1.  CREATE USER 'ESMUser'@'localhost' IDENTIFIED BY 'password';

2.  CREATE DATABASE EmailSubscriptionManager;

3.  USE EmailSubscriptionManager;

4.  CREATE TABLE all_links (user VARCHAR(100) NOT NULL, vendor VARCHAR(10000) NOT NULL, link VARCHAR(10000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));

5.  GRANT SELECT, INSERT, DELETE, CREATE, UPDATE ON `database`.* TO `ESMUser`@`localhost`;

Note: If you encounter the ERROR 1396 (HY000): Operation CREATE USER failed, when adding a user you have just dropped before, it is caused by a bug from MySQL. You can get around it with the following instruction:
    1.  drop user ESMUser@localhost;
    2.  flush privileges;
    3.  create user ESMUser@localhost identified by 'password'
* Bixing Xie (bx357@nyu.edu)
* Bronson Lee (bkl263@nyu.edu )
* Mengzhe Ding (md3837@nyu.edu)
