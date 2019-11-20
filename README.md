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



## One-Click™ Unsubscribe functionality:
Currently looks for html <buttons> or <inputs> with keywords "unsubscribe", "confirm", "yes", or "save" and clicks on it. <inputs> of type "checkbox" are switched to their off state if already on and on state if already off. The rationale behind this is that most email subscription providers generally leave these checkboxes in a starting state that needs user confirmation and favor keeping the user on their subscription list. If One-Click™ cannot find a matching keyword it will notify that One-Click™ functionality is unavailable.


## Credits

* **Bixing Xie** - (https://github.com/bixingxie)
* **Bronson Lee** - (https://github.com/bkl263)
* **Mengzhe Ding** - (https://github.com/MengzheDing)
