const express = require("express");
const bodyParser = require("body-parser");

const Mailchimp = require("mailchimp-api-v3");
const aws = require("aws-sdk");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add your Mailchimp credentials here
const apiKey = "";
const listId = "";
const mailchimp = new Mailchimp(apiKey);

app.post("/api/newsletter/subscribe", function(req, res) {
  mailchimp
    .request({
      method: "POST",
      path: "/lists/" + listId + "/members",
      body: {
        email_address: req.body.email,
        // Set status to "subscribed" to disable double-opt-in
        status: "pending"
      }
    })
    .then(result => {
      res.send({ status: "success" });
    })
    .catch(err => {
      res.send({ status: "error" });
    });
});

// Add your AWS credentials here
aws.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-west-2"
});

// Load AWS SES
const ses = new aws.SES({ apiVersion: "2010-12-01" });
// Add your email address here
const to = [""];
// Also add your email address as the sender
// Must belong to a verified SES account
const from = "";

app.post("/api/contact/subscribe", function(req, res) {
  ses.sendEmail(
    {
      Source: from,
      Destination: { ToAddresses: to },
      Message: {
        Subject: {
          Data: `Contact form submission`
        },
        Body: {
          Text: {
            Data: `
                Name: ${req.body.name}
                Email: ${req.body.email}
                Message: ${req.body.message}
              `
          }
        }
      }
    },
    (err, data) => {
      if (err) {
        res.send({ status: "error" });
      } else {
        res.send({ status: "success" });
      }
    }
  );
});

app.post('/sessionLogin', (req, res) => {
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();
  // Guard against CSRF attacks.
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {
     // Set cookie policy for session cookie.
     const options = {maxAge: expiresIn, httpOnly: true, secure: true};
     res.cookie('session', sessionCookie, options);
     res.end(JSON.stringify({status: 'success'}));
    }, error => {
     res.status(401).send('UNAUTHORIZED REQUEST!');
    });
});

app.listen(8080, function() {
  console.log("Server listening on port 8080");
});
