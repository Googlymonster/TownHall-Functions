const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
admin.initializeApp();

const config = {
  apiKey: "AIzaSyBlk0_MeUzwjbYfYwC6XMaIB3VQ6ZhmzuY",
  authDomain: "townhall-b9af6.firebaseapp.com",
  databaseURL: "https://townhall-b9af6.firebaseio.com",
  projectId: "townhall-b9af6",
  storageBucket: "townhall-b9af6.appspot.com",
  messagingSenderId: "24689154572",
  appId: "1:24689154572:web:27febc59839a40bdd36c29",
  measurementId: "G-G9HFQHZKPB"
};

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/shouts", (request, response) => {
  admin
    .firestore()
    .collection("shouts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let shouts = [];
      data.forEach(doc => {
        shouts.push({
          shoutId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return response.json(shouts);
    })
    .catch(error => console.error(error));
});

app.post("/shout", (request, response) => {
  const newShout = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin
    .firestore()
    .collection("shouts")
    .add(newShout)
    .then(doc => {
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});
// Signup route
app.post("/signup", (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  };

  // TODO: validate date

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return response
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
