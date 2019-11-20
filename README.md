# Email-Subscription-Manger
ESM is a web application developed with Node.JS, Express, React.JS, and MySQL. ESM displays user's subscription emails and provides One-Click™ unsubscribe functionality.



## Building
Please refer to the [build file](/build.md).



## Limitations

1. Currently only works for NYU school emails because Gmail API's security standard. Publishing the app and having it work for all Gmails will require Google's approval.

2. Currently Database only works for Windows and Mac OS.

3. It is best to explicitly log out everytime to prevent possible bugs associated with the use of Cookies in the front end.

   

## How do we find your subscription email? 

Using Gmail API provided by Google, we are able to fetch emails with a query (for example, emails that contain keywords such as subscribe, unsubscribe, subscriptions, etc). Then, with the help of Cheerio.JS, we are able to analyze the raw HTML text of these emails and extract unsubcribe link (usually a href next to a keyword). Finally, we update database accordingly.



## How does One-Click™ work?

Uses [Nightmare.JS](https://github.com/segmentio/nightmare), a high level JS automation library, the application looks for html <buttons> or <inputs> with keywords "unsubscribe", "confirm", "yes", or "save" and clicks on it. <inputs> of type "checkbox" are switched to their off state if already on and on state if already off. The rationale behind this is that most email subscription providers generally leave these checkboxes in a starting state that needs user confirmation and favor keeping the user on their subscription list. If One-Click™ cannot find a matching keyword it will notify that One-Click™ functionality is unavailable.

Per current immature testing, One-Click™ works on ~30% of the subscriptions emails we have. One-Click™ could work for more cases but that will require scrutiny into the HTML for a specific vendor unsubscriptionn page. For example, on Amazon's unsubscribe page, the button is rendered as an image input instead of a text input, which is a case we didn't check for. By adding a check, we achieved One-Click™ on Amazon.



## How we use your data? 

ESM values user privacy and therefore only runs through subscription email content. ESM only stores the sender of subscription emails and the link to unsubscribe. 



## Architecture 

Frontend: React.JS

Backend: Node.JS, Express.JS

Database: MySQL


## Next Steps 

1. Public deployment, which will require Google's consent. But it will also resolve the current limitation that the application only works for NYU school email. 
2. Testing. Currently there are no systematic testing procedures in place. A suite of integration tests and unit tests, and a CI-CD pipeline, will be desirable. 
3. Improve One-Click™. Make it such that One-Click™ works for more cases, at least for all the well-known subscriptions.  



## External Resources 

Please refer to package.json for a complete list of libraries we've used. The main ones are mentioned below.

* [Material-UI](https://material-ui.com/):  React components.
* [Express.JS](https://expressjs.com/): Node.JS web framework.
* [Nightmare.JS](https://github.com/segmentio/nightmare): JS automation library.
* [Cheerio.JS](https://github.com/cheeriojs/cheerio): For parsing markup and traversing the resulting data structure.
* [MySQL.JS](https://github.com/mysqljs/mysql): Node.JS javascript client implementing the MySQL protocol. 
* [react-google-login](https://www.npmjs.com/package/react-google-login): React component for logging in/out Google account.




## Contributors

* **Bixing Xie** - (https://github.com/bixingxie)
* **Bronson Lee** - (https://github.com/bkl263)
* **Mengzhe Ding** - (https://github.com/MengzheDing)
* With advisement of **Professor Jeff Epstein**
