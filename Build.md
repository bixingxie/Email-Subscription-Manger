# Dependencies
1. Install **node** (skip if you have node already)

   You could install using brew if you are on Mac:

   ```shell
   brew install node
   ```

   Alternatively, you can download node here: https://nodejs.org/en/. Npm is included when you install node.

2. Change directory to the backend and npm install

   ```shell
   cd ESM-Server
   npm install
   ```

3. Change directory to the frontend and npm install

   ```shell
   cd esm-app
   npm install
   ```



# Set Up MySQL Database

1. Please install MAMP (for Mac) or WAMP (for windows), or any MySQL server and run it on localhost.

2. Create a new user:

   ```mysql
   CREATE USER 'ESMUser'@'localhost' IDENTIFIED BY 'ESMPassword';
   ```

3. Create a new database:

   ```mysql
   CREATE DATABASE EmailSubscriptionManager;
   ```

4. Go to the new database:

   ```mysql
   USE EmailSubscriptionManager;
   ```

5. Create a new table:

   ```mysql
   CREATE TABLE all_links (user VARCHAR(500) NOT NULL, vendor VARCHAR(500) NOT NULL, link VARCHAR(10000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));
   ```

6. Grant privileges to the user:

   ```mysql
   GRANT SELECT, INSERT, DELETE, CREATE, UPDATE ON database.* TO ESMUser@localhost;
   ```

**Note**: If you encounter the ERROR 1396 (HY000): Operation CREATE USER failed, when adding a user you have just dropped before, it is caused by a bug from MySQL. You can get around it with the following instruction:

```mysql
drop user ESMUser@localhost;
flush privileges;
create user ESMUser@localhost identified by 'password'
```



# Build

### Database

Make sure that you have the MySQL database running. It is currently set up in the backend that it will try to connect to MySQL server at port 8889 if you are using a Mac OS, or port 3306 if you are using a Windows OS, which are usually the default ports for the two different systems. If your MySQL database runs on a different port or you would like to select your own port, please go to ESM-Server/index.js and overwrite lines 19-21 to:
```javascript
var DBPORT = INSERT YOUR MYSQL PORT HERE;
```

### Starting Backend Server

Start terminal and change directory to the backend. Then start the server.
```shell
cd ESM-Server
node index.js
```
Backend server should be running at: http://localhost:4000/

### Starting the Email Subscription Manager

Start a new terminal, change directory to the frontend.

```shell
cd esm-app
npm start
```

A new window on your default browser should pop up. If this does not occur please, open any web browser and visit http://localhost:3000/



# Contact

We tested the build process on both Mac and Windows machines and it should work. Please kindly let us know if any problem happens.


* Bixing Xie (bx357@nyu.edu)
* Bronson Lee (bkl263@nyu.edu )
* Mengzhe Ding (md3837@nyu.edu)
