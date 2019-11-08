const { google } = require("googleapis");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");

const app = express();
const router = express.Router();

const REDIRECT_URLS = ["http://localhost:3000"];
const CLIENT_SECRET = "ofE8qOpv4zKTJbWN9fwqJqXh";
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

// locally cached record of subscription. in the format of:
// {vendorName : {typeofLink(subscription/unsubscribe) : [links]}}
// therefore, accessing a link is subscription[vendorName]["subscription"][idx]
const subscription = {};

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use("/", router);

/**
 * Get number of emails under a particular label.
 * @param {OAuth2Client} auth    Authorization object.
 * @param {string}       labelID Number of emails to get.
 */
const getNumberOfEmails = (auth, labelID) => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels
    .get({
      userId: "me",
      id: labelID
    })
    .then(response => {
      // console.log("Message total: ", response.data.messagesTotal);
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Gets a list of emails from the Gmail API.
 * @param {OAuth2Client} auth Authorization object.
 * @param {function} callback Callback function to execute.
 */
const getEmailList = (auth, callback) => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages
    .list({
      userId: "me",
      includeSpamTrash: false,
      q: "unsubscribe OR subscription"
    })
    .then(response => {
      callback(auth, response.data.messages);
    });
};

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
      if (!parts) {
        return;
      }
      parts.filter(part => {
        return part.mimeType == "text/plain";
      });

      parts.forEach(part => {
        if (part.body.data != null) {
          const headers = response.data.payload.headers;
          const sender = searchHeaders(headers, "From");
          const emailDate = searchHeaders(headers, "Date");
          const message = Buffer.from(part.body.data, "base64").toString();

          const $ = cheerio.load(message);
          const links = $("a");
          $(links).each((i, link) => {
            const text = $(link)
              .text()
              .toLowerCase();
            if (
              text.indexOf("subscribe") !== -1 ||
              text.indexOf("subscription") !== -1
            ) {
              subscription[sender] = $(link).attr("href");
              return;
            }
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Searches a specific header given a header name.
 * @param   {Array}   headers    Headers of a particular message.
 * @param   {string}  headerName Name of the header to search for.
 *
 * @returns {string} Returns the value of the header if found, undefined otherwise.
 */
function searchHeaders(headers, headerName) {
  const res = headers.find(elem => {
    return elem.name == headerName;
  });
  return res ? res.value : undefined;
}

/**
 * Finds an array of hyperlinks that match the keyword.
 * @param   {string} message     The email.
 * @param   {Array}  keywordList A list of keyword to search for.
 * @param   {string} sender      Sender of the email.
 * @param   {string} date        Date when the email is sent.
 *
 * @returns {string} Returns the value of the header if found, undefined otherwise.
 */
function getUnsubscriptionLink(message, keywordList, sender, date) {
  const links = {};

  keywordList.forEach(item => {
    const keywordLink = searchLinkByKeyword(message, item);
    if (keywordLink.length > 0) {
      links[item] = keywordLink;
    }
  });
  if (Object.keys(links).length > 0) {
    subscription[sender] = links;
  }
}

//finds an array of hyperlinks with the given keyword
function searchLinkByKeyword(message, keyword) {
  let result = [];

  while (message.search("<a href=")) {
    const start = message.search("<a href=");
    if (start == -1) {
      break;
    }
    const endstart = message.slice(start).search("</ *a *>");
    let end;
    if (endstart > 0) {
      end = message.slice(start + endstart).search(">");
      end = start + endstart + end + 1;
      const link = message.slice(start, end);
      if (link.search(keyword) > 0) {
        // console.log("effective link: ", link);
        idx1 = link.search('"');
        idx2 = link.slice(idx1 + 1).search('"');
        // console.log(idx1, " ", idx2);
        result.push([keyword, link.slice(idx1 + 1, idx1 + idx2 + 1)]);
      }
      message = message.slice(end);
    } else {
      message = message.slice(start + 1);
    }
  }
  return result;
}

/**
 * Return an array of email content
 * @param {OAuth2Client} auth      Authorization object.
 * @param {Array}        emailList A list of email to print.
 */
const printEmailList = (auth, emailList) => {
  return emailList.map(emailObj => getEmailContent(auth, emailObj.id));
};

/**
 * Creates and initializes an authorization object given a token object
 * @param {Object} tokenObj  Authorization token.
 * @param {Array}  emailList A list of email to print
 */
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
  res.send({ status: "SUCCUSS" });
});

router.post("/get_token", (req, res) => {
  try {
    const tokenObj = req.body;
    const oAuth = initoAuthObj(tokenObj);
    getEmailList(oAuth, printEmailList);
    getNumberOfEmails(oAuth, "INBOX");
  } catch (e) {
    res.send({ status: "SUCCUSS" });
    console.log(e);
  }
  res.send({ status: "SUCCUSS" });
});

router.get("/manage_subscription/", (req, res) => {
  try {
    if (Object.keys(subscription).length > 1) {
      console.log(subscription);
      res.status(200).send(JSON.stringify(subscription));
    } else {
      res.status(200).send("Fetching subscriptions.");
    }
  } catch (err) {
    res.status(400).json({
      message: "Error fetching subscriptions.",
      err
    });
    res.send();
  }
});

app.listen(4000, () => {
  console.log("ESM Server listening on port 4000");
});
