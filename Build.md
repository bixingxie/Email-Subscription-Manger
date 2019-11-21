# Dependencies

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

Make sure that you have the MySQL database running. It is currently set up in the backend that it will try to connect to MySQL server at port 8889 if you are using a Mac OS, or port 3306 if you are using a Windows OS, which are usually the default ports for the two different systems. If your MySQL database runs on a different port, please go to ESM-Server/index.js and overwrite lines 19-21 to: 
```javascript
var DBPORT = [INSERT YOUR MYSQL PORT HERE];
```

### Backend

Change directory to the backend. 

```
cd ESM-Server
nodemon index.js
```

Backend server should be running at: http://localhost:4000/

### Frontend

Strat a new terminal, change directory to the frontend.

```
cd esm-app
yarnpkg start
```

A new window should pop up, if not, please visit frontend at http://localhost:3000/

## Contact

* Bixing Xie (bx357@nyu.edu)
* Bronson Lee (bkl263@nyu.edu )
* Mengzhe Ding (md3837@nyu.edu)
