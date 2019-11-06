const { google } = require("googleapis");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var anchorme = require("anchorme").default; // if installed via NPM

const app = express();
const router = express.Router();

const REDIRECT_URLS = ["http://localhost:3000"];
const CLIENT_SECRET = "ofE8qOpv4zKTJbWN9fwqJqXh";
const CLIENT_ID =
  "602826117073-lt0upfo5khvk59dqf0u50ruor73rrg6n.apps.googleusercontent.com";



// locally cached record of subscription. in the format of:
// {vendorName : {typeofLink(subscription/unsubscribe) : [links]}}
// therefore, accessing a link is subscription[vendorName]["subscription"][idx]
let subscription ={};

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use("/", router);


/**
 * Get number of emails under a particular label
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
      console.log("Message total: ", response.data.messagesTotal);
    })
    .catch(err => {
      console.log(err);
    });
};

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
      maxResults: maxResults,
      q: "subscription"
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

      // Filters non-text/plain stuff
      parts.filter(function(part) {
        return part.mimeType == "text/plain";
      });

      parts.forEach(part => {
        if (part.body.data != null) {
          const header = response.data.payload.headers
          const msg = Buffer.from(part.body.data, "base64").toString();
          console.log("Getting links from ", searchHeader(header, "From"))
          getLink(msg, searchHeader(header, "From"), searchHeader((header, "Date")));
        }
      });
    })
      .catch(err => {
        console.log(err);
      });
};

function searchHeader(header, key){
  rst = "undefined"
  for(var idx in header) {
    console.log(header[idx])

    if (header[idx].name == key) {
      rst = header[idx].value
      break
    }
  }
    return rst
}

//finds an array of hyperlinks with the keywords hardcoded in the keyword array below.
function getLink(msg, vendorName, date){
  let links = {};
  const keyword = ["unsubscribe", "subscription"];

  keyword.forEach(function(item){
    const linksfromkw = getLinkKeyword(msg, item)
    if(linksfromkw.length > 0){
      links[item] = linksfromkw
    }
  });
  if(Object.keys(links).length > 0){
    subscription[vendorName] = links;
  }
}

//finds an array of hyperlinks with the given keyword
function getLinkKeyword(msg, keyword){
  let rst = [];
  while (msg.search(keyword)){
    var idx = msg.search(keyword);
    const endstart = msg.slice(idx).search("</ *a *>");
    var end;
    var start;
    if(endstart == -1){
      break
    }
    else{
      end = msg.slice(idx + endstart).search(">");
      if(end == -1 || end > 50){
        break
      }
      end = idx + endstart + end + 1;
      start = msg.lastIndexOf("<a", idx);
    };
    const range = msg.slice(start, end);
    const link = anchorme(range);
    if(link.length > 0){
      rst.push([keyword, link])
    }
    msg = msg.slice(idx,)
  }
  return rst
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
    getEmailList(oAuth, 5, printEmailList);
    getNumberOfEmails(oAuth, "INBOX");
  } catch (e) {
    res.send({ status: "SUCCUSS" });
    console.log(e);
  }
  res.send({ status: "SUCCUSS" });
});

router.get("/subscriptionManagement/", (req, res) =>{
  try{
    if (Object.keys(subscription).length > 1){
      msg = JSON.stringify(subscription)
      res.status(200).send(msg);
    }else{
      res.status(200).send("Fetching your subscription, please reload later");
    }
  }catch(err){
    res.status(400).json({
      message: "Error occured when collecting subscription",
      err
    });
    res.send()
  }
})


app.listen(4000, () => {
  console.log("ESM Server listening on port 4000");
});
