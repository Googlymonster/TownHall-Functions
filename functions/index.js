const functions = require("firebase-functions");
const express = require("express");
const app = express();
const FBAuth = require("./util/fbAuth");

const { getAllShouts, postOneShout } = require("./handlers/shouts");
const { signUp, login, uploadImage, addUserDetails } = require("./handlers/users");

// Shout Routes
app.get("/shouts", getAllShouts);
app.post("/shout", FBAuth, postOneShout);
app.post("/user", FBAuth, addUserDetails);

// Auth route
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
