# Email-Subscription-Manger
ESM is a web application developed with Node.JS, Express, React.JS, and MySQL. ESM helps to clean the user's cluttered email inbox. 



## State of the Program 

**Finished:** 

1. Authenticate the user via Gmail API on the frontend. 
2. Pass the authorization token object to the backend (Node.JS). 
3. Read a list of user emails in HTML format in the backend. 
4. Parsing and grouping subscription emails. 
5. Displaying parsed emails on the frontend. 

**To do**: 

1. Persistant storage (MySQL)
2. Better UI 
3. 1-Click Unsubscribe 
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

See `esm.sql` for a copy of databse schema. **Recommended**: running phpMyAdmin at `localhost:8889`



## Credits 

* **Bixing Xie** - (https://github.com/bixingxie)
* **Bronson Lee** - (https://github.com/bkl263)
* **Mengzhe Ding** - (https://github.com/MengzheDing)
