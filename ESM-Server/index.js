const { google } = require("googleapis");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const mysql = require("mysql");
const Nightmare = require('nightmare');

const app = express();
const router = express.Router();

const REDIRECT_URLS = ["http://localhost:3000"];
const CLIENT_SECRET = "ofE8qOpv4zKTJbWN9fwqJqXh";
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

const connection = mysql.createConnection({
  host: "localhost",
  user: "ESMUser",
  port: "8889",
  password: "ESMPassword",
  database: "EmailSubscriptionManager"
});

// Connects to the MySQL database
connection.connect(err => {
  if (err) {
    return err;
  }
});

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use("/", router);

//list of cached values for development before they are moved to database
let subscription = {};
let current_user = "bx357";

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
      // console.log(err);
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
              const unsubLink = $(link).attr("href");
              sendUnsubLinkToDB(current_user, emailDate, sender, unsubLink);
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
 * pass the found link to database
 * @param {String} user
 * @param {String} timestamp
 * @param {String} sender
 * @param {String} link Link to be stored
 */
const sendUnsubLinkToDB = (user, timestamp, sender, linkFetched) => {
  sender = sender.replace(/"/g, "").replace(" ", "");
  const jsTimeStamp = Date.parse(timestamp) / 1000;

  const sqlSelectOneLink = `SELECT user, vendor, link, UNIX_TIMESTAMP(last_modified) as last_modified, unsubscribed
  FROM all_links WHERE user="${user}" AND vendor="${sender}"`;
  connection.query(sqlSelectOneLink, (err, result) => {
    if (err) {
      return console.log(err);
    } else {
      let valid = false;
      let update = false;

      if (result.length == 0) {
        valid = true;
      } else {
        if (jsTimeStamp > result[0].last_modified) {
          valid = true;
          update = true;
        }
      }

      //update database
      if (valid) {
        let sql;
        if (update) {
          sql = `UPDATE all_links SET link = "${linkFetched}", unsubscribed = 0, last_modified = FROM_UNIXTIME(${jsTimeStamp})
          WHERE user="${user}" AND vendor="${sender}"`;
        } else {
          sql = `INSERT INTO all_links (user, vendor, link, unsubscribed, last_modified)
          VALUES ("${user}", "${sender}", "${linkFetched}", 0, FROM_UNIXTIME(${jsTimeStamp}))
          ON DUPLICATE KEY UPDATE link = "${linkFetched}", unsubscribed = 0, last_modified = FROM_UNIXTIME(${jsTimeStamp})`;
        }
        connection.query(sql, (err, results) => {
          if (err) {
            return console.error(err);
          } else {
            return console.log(
              "sendUnsubLinkToDB: unsubscription link sent to DB"
            );
          }
        });
      }
    }
  });
};

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
    res.send({ status: "ERROR" });
  }
  res.send({ status: "SUCCUSS" });
});

router.get("/manage_subscription/", (req, res) => {
  const sql = `SELECT * FROM all_links WHERE user="${current_user}"`
  const fullSql = Object.keys(req.query).length == 0 ? (sql + ` AND unsubscribed=0`): (sql+` AND unsubscribed=1`)

  connection.query(fullSql, (err, results) => {
    const subtable = {};
    if (err) {
      return console.error(err);
    } else {
      results.forEach(item => {
        const date = JSON.stringify(item.last_modified).split("T")[0].slice(1, )
        subtable[item.vendor] = {url: item.link, date: date};
      })
    }

    try {
      res.status(200).send(JSON.stringify(subtable));
    } catch (err) {
      res.status(400).json({
        message: "Error fetching subscriptions.",
        err
      });
      res.send();
    }
  });
});


const oneClickUnsub = url => {
  var debugArr = [];
  const nightmare = Nightmare(
    { openDevTools: {
      mode: 'detach'
    },

    show: false })

  return new Promise(resolve => {
    nightmare
      .goto(url)
      .evaluate((debugArr) => {
        var buttons = document.getElementsByTagName('button')
        var inputs = document.getElementsByTagName('input')

        function checkKeywords(string) {
          var keywords = ["unsubscribe", "confirm"]
          var returnVal = false
          for (keyword of keywords) {
            returnVal = (string.toLowerCase().includes(keyword) || returnVal)
          }
          return returnVal

        }


        function decide(elements) {
          for (element of elements) {
            if(checkKeywords(element.innerHTML) || checkKeywords(element.value)) {
              element.className += " unsubscribe-click-object"
            }
            debugArr.push({class: element.className, name: element.name, html: element.innerHTML})

          }
        }


        decide(buttons)
        decide(inputs)

        return debugArr
      }, debugArr)
      .click(".unsubscribe-click-object")
      .end()
      .then((debugArr) => { //debugArray only works when .click() line above is commented out
        // console.log(debugArr)
        console.log("oneClickUnsub() Sucuess")
        resolve(true)
      })
      .catch(error => {
        console.log("oneClickUnsub() One-click option unavailable" )
        nightmare.end()
        resolve(false)
      });
  })
}

router.post("/unsubscribe", async (req,res) => {
  const url = req.body.link;
  console.log("/unsubscribe called to url: " + url)
  try {
    await oneClickUnsub(url).then((response) => {
      console.log("/unsubscribe " + response)
      res.sendStatus(200)
    })
  } catch (err) {
      console.log("/unsubscribe " + err)
  }
})

app.listen(4000, () => {
  console.log("ESM Server listening on port 4000");
});
