const { google } = require("googleapis");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const REDIRECT_URLS = ["http://localhost:3000"];
const CLIENT_SECRET = "ofE8qOpv4zKTJbWN9fwqJqXh";
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use("/", router);

/**
 * Gets a list of emails from the Gmail API. 
 * @param {OAuth2Client} auth Authorization object.
 * @param {int} maxResults    Number of emails to get.
 * @param {function} callback Callback function to execute.  
 */
const getEmailList = (auth, maxResults, callback) => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages
    .list({
      userId: "me",
      includeSpamTrash: false,
      maxResults: maxResults
    })
    .then(response => {
      callback(auth, response.data.messages) 
    });
}

/**
 * Gets the email content of a particular email from the Gmail API. 
 * @param {OAuth2Client} auth    Authorization object.
 * @param {string}       emailID The email ID to get. 
 */
const getEmailContent = (auth, emailID) => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages
    .get({
      userId: "me",
      id: emailID,
      format: "full"
    })
    .then(response => {
      const parts = response.data.payload.parts;

      // Filters non-text/plain stuff
      parts.filter(function(part) {
        return part.mimeType == 'text/plain'; 
      })

      parts.forEach(part => {
        if (part.body.data != null) {
          const msg = Buffer.from(part.body.data, "base64").toString();
          console.log(msg);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const printEmailList = (auth, emailList) => {
    return emailList.map(emailObj => (getEmailContent(auth, emailObj.id)))
}

// Creates and initializes an authorization object given a token object
const initoAuthObj = tokenObj => {
  const oAuth = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URLS[0]
  );
  oAuth.setCredentials(tokenObj);
  return oAuth;
};

router.get("/", (req, res) => {
  res.send("hi, this is the backend server");
});

router.post("/get_token", (req, res) => {
  try {
    const tokenObj = req.body;
    const oAuth = initoAuthObj(tokenObj);
    getEmailList(oAuth, 5, printEmailList);
  } catch (e) {
    console.log(e);
  }
  // getEmailContent(oAuth, "16de25e2b387e546");
  // res.send({ status: "SUCCUSS" });
});

app.listen(4000, () => {
  console.log("ESM Server listening on port 4000");
});
