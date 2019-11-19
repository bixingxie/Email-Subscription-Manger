# Email-Subscription-Manger
ESM is a web application developed with Node.JS, Express, React.JS, and MySQL. ESM helps to clean the user's cluttered email inbox.



## State of the Program

**Finished:**

1. Authenticate the user via Gmail API on the frontend.
2. Pass the authorization token object to the backend (Node.JS).
3. Read a list of user emails in HTML format in the backend.
4. Parsing and grouping subscription emails.
5. Displaying parsed emails on the frontend.
6. 1-Click Unsubscribe

**To do**:

1. Persistant storage (MySQL)
2. Better UI

4. Add Popular Subscriptions

## Dependencies

1. Npm

    `brew install npm`

2. Yarn

   `brew install yarn`

3. Express, MySQL, Cors

   `yarnpkg add express mysql cors`

4. Nodemon

   `npm install -g nodemon`

5. React.JS



## Running the App

### Backend

`nodemon index.js`

### Frontend

`yarnpkg start`

### Databse

**Recommended**: running phpMyAdmin at `localhost:8889`

I'm using mysql 5.6
Create a user ESMUser with password ESMPassword in mysql. It can be achieved by "add a new user" link on phpmyadmin under the Privileges tab, or by running
SET PASSWORD for 'ESMUser'@'localhost' = password('ESMPassword')
in MySQL console.
We need privileges Select, Insert, Create, Update

Then we will create a database EmailSubscriptionManager and a table all_links

CREATE DATABASE EmailSubscriptionManager;
CREATE TABLE all_links (user VARCHAR(100) NOT NULL, vendor VARCHAR(300) NOT NULL, link VARCHAR(1000) NOT NULL, last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, unsubscribed BOOLEAN not null DEFAULT 0, PRIMARY KEY(user, vendor));

## One-Click™ Unsubscribe functionality:
Currently looks for html buttons or inputs with keywords unsubscribe, confirm, or yes and clicks on it. If it cannot find a matching keyword it will notify
that One-Click™ functionality is unavailable.


## Credits

* **Bixing Xie** - (https://github.com/bixingxie)
* **Bronson Lee** - (https://github.com/bkl263)
* **Mengzhe Ding** - (https://github.com/MengzheDing)
