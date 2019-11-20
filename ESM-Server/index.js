const { google } = require("googleapis");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const mysql = require("mysql");
const Nightmare = require("nightmare");

const app = express();
const router = express.Router();

const REDIRECT_URLS = ["http://localhost:3000"];
const CLIENT_SECRET = "ofE8qOpv4zKTJbWN9fwqJqXh";
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";

const OS = process.platform;
var DBPORT;
if(OS == "darwin") { DBPORT = 8889 }
if(OS == "win32") { DBPORT = 3306 }

const connection = mysql.createConnection({
  host: "localhost",
  user: "ESMUser",
  port: DBPORT,
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
  console.log("getEmailList()")
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise(resolve => {
    gmail.users.messages
      .list({
        userId: "me",
        includeSpamTrash: false,
        q: "unsubscribe OR subscription"
      })
      .then(response => {
        resolve(response.data.messages)
        console.log("getEmailList() done")
        })
  })
}

/**
 * Gets the email content of a particular email from the Gmail API.
 * @param {OAuth2Client} auth    Authorization object.
 * @param {string}       emailID The email ID to get.
 */
const getEmailContent = (auth, emailID) => {
  console.log("getEmailContent(" + emailID + ") called")

  const gmail = google.gmail({ version: "v1", auth });
  return new Promise(resolve => {
    gmail.users.messages
      .get({
        userId: "me",
        id: emailID,
        format: "full"
      })
      .then(async response => {
        const parts = response.data.payload.parts;
        if (!parts) {
          return null;
        }

        parts.filter(part => {
          part.mimeType == "text/plain";
        });

        var emailContent = null

        for (part of parts) {
          console.log("getEmailContent(" + emailID + ") part " + (parseInt(part.partId) + 1) + "/" + parts.length)
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
                text.indexOf("subscription") !== -1 ||
                text.indexOf("unsubscribe") !== -1
              ) {
                console.log("getEmailContent() found subscription")
                const linkFetched = $(link).attr("href");
                emailContent = {date: emailDate, sender: sender, link: linkFetched, id: emailID}
                return false;
              }
              return true
            })
          }
        }
        return emailContent;
      })
      .then((emailContent) => {
        console.log("getEmailContent(" + emailID + ") done")
        resolve(emailContent)
      })
      .catch(err => {
        console.log(err);
      });
  })

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
const storeToDB = (user, timestamp, sender, linkFetched) => {
  console.log("storeToDB() called")
  sender = sender.replace(/"/g, "").replace(" ", "");
  const jsTimeStamp = Date.parse(timestamp) / 1000;

  const sql = `SELECT user, vendor, link, UNIX_TIMESTAMP(last_modified) as last_modified, unsubscribed
  FROM all_links WHERE user="${user}" AND vendor="${sender}"`;

  return new Promise(resolve => {

    connection.query(sql, (err, rst) => {
      if (err) {
        console.log("storeToDB() " + err);
        resolve(false)
      } else {
        var valid = false; //if current vendor user pair is new to db
        var update = false; //if current vendor user paird needs be posted

        if (rst.length == 0) {
          valid = true;
        } else {
          if (jsTimeStamp > rst[0].last_modified) {
            valid = true;
            update = true;
          }
        }

        //update database
        if (valid) {
          let sql;
          if (update) {
            console.log("updating DB");
            sql = `UPDATE all_links SET link = "${linkFetched}", unsubscribed = 0, last_modified = FROM_UNIXTIME(${jsTimeStamp})
            WHERE user="${user}" AND vendor="${sender}"`;
          } else {
            console.log("INSERTING into DB");
            sql = `INSERT INTO all_links (user, vendor, link, unsubscribed, last_modified)
            VALUES ("${user}", "${sender}", "${linkFetched}", 0, FROM_UNIXTIME(${jsTimeStamp}))
            ON DUPLICATE KEY UPDATE link = "${linkFetched}", unsubscribed = 0, last_modified = FROM_UNIXTIME(${jsTimeStamp})`;
          }
          connection.query(sql, (err, results) => {
            if (err) {
              console.log(err);
              resolve(false)
            } else {
              console.log("sendUnsubLinkToDB: unsubscription link sent to DB");
              resolve(true)
            }
          })
        } else { console.log("storeToDB() invalid"); resolve(false); }
      }
    })
  })
};

/**
 * Return an array of email content
 * @param {OAuth2Client} auth      Authorization object.
 * @param {Array}        emailList A list of email to print.
 */
// const getEmailAndStoreToDB = (auth, emailList) => {
//   console.log("mapEmails() called")
//   return new Promise((resolve) => {
//     emailList.map(emailObj => {
//       getEmailContent(auth, emailObj.id)
//       .then(email => {
//         storeToDB(app.locals.userEmail, email.date, email.sender, email.link)
//         .then(() => {
//           console.log("mapEmails() done")
//           resolve(true)
//         })
//       })
//     })
//   })
// };

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

router.post("/get_token", async (req, res) => {
  console.log("/get_token called")
  try {
    const tokenObj = req.body;
    app.locals.oAuth = initoAuthObj(tokenObj);
    await getEmailList(app.locals.oAuth)
    .then(async (emailList) => {
      for(emailObj of emailList) {
        var emailContent = await getEmailContent(app.locals.oAuth, emailObj.id)
        if(emailContent) {
          console.log("calling storeToDB() on emailID " + emailContent.id)
          await storeToDB(app.locals.userEmail, emailContent.date, emailContent.sender, emailContent.link)
        }
      }
    })
    .then(() => {
      console.log("/get_token Success")
      res.send({ status: "SUCCUSS" });
    })
  } catch (e) {
    console.log("/get_token " + e)
    res.send({ status: "ERROR" });
  }
})

router.get("/get_email", (req, res) => {
  try {
    app.locals.userEmail = req.query["email"];
    res.send({ status: "SUCCUSS" });
  } catch (e) {
    console.log(e);
    res.send({ status: "ERROR" });
  }
});

router.get("/persistUnsubscribe", (req, res) => {
  const vendor = req.query["vendor"];
  const CURRENT_TIMESTAMP = {
    toSqlString: function() {
      return "CURRENT_TIMESTAMP()";
    }
  };
  const sql = mysql.format(
    "UPDATE all_links SET unsubscribed = ?, last_modified = ? WHERE vendor = ?",
    [1, CURRENT_TIMESTAMP, vendor]
  );

  connection.query(sql, (err, results) => {
    try {
      res.sendStatus(200);
    } catch (err) {
      console.log("/persistUnsubscribe/", err);
      res.sendStatus(500);
    }
  });
});

router.get("/manage_subscription/", (req, res) => {
  const sql = `SELECT * FROM all_links WHERE user="${app.locals.userEmail}"`;
  // const sql = `SELECT * FROM all_links WHERE user="bx357"`;
  const fullSql =
    Object.keys(req.query).length == 0
      ? sql + ` AND unsubscribed=0`
      : sql + ` AND unsubscribed=1`;

  console.log(sql);

  connection.query(fullSql, (err, results) => {
    const subtable = {};
    if (err) {
      return console.error(err);
    } else {
      results.forEach(item => {
        const date = JSON.stringify(item.last_modified)
          .split("T")[0]
          .slice(1);
        subtable[item.vendor] = { url: item.link, date: date };
      });
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
  const nightmare = Nightmare({
    openDevTools: {
      mode: "detach"
    },
    show: false
  });

  return new Promise(resolve => {
    nightmare
      .goto(url)
      .evaluate(() => {
        var buttons = document.getElementsByTagName("button");
        var inputs = document.getElementsByTagName("input");

        function checkKeywords(string) {
          var keywords = ["unsubscribe", "confirm", "yes"];
          var returnVal = false;
          for (keyword of keywords) {
            returnVal = string.toLowerCase().includes(keyword) || returnVal;
          }
          return returnVal;
        }

        function decide(elements) {
          for (element of elements) {
            if (
              checkKeywords(element.innerHTML) ||
              checkKeywords(element.value)
            ) {
              element.className += " unsubscribe-click-object";
            }
          }
        }

        decide(buttons);
        decide(inputs);

        // return debugArr;
      })
      .click(".unsubscribe-click-object")
      .end()
      .then(() => {
        console.log("oneClickUnsub() Success");
        resolve(true);
      })
      .catch(error => {
        console.log("oneClickUnsub() One-click option unavailable");
        nightmare.end();
        resolve(false);
      });
  });
};

router.post("/unsubscribe", async (req, res) => {
  const url = req.body.link;
  console.log("/unsubscribe called to url: " + url);
  try {
    await oneClickUnsub(url).then(response => {
      if (response) {
        res.send({ status: "SUCCESS" });
      } else {
        res.send({ status: "ERROR" });
      }
      console.log("/unsubscribe " + response);
    });
  } catch (err) {
    console.log("/unsubscribe " + err);
  }
});

app.listen(4000, () => {
  console.log("ESM Server listening on port 4000");
  console.log("ESM DB on port " + DBPORT)
});
