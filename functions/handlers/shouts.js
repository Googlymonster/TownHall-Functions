const { db } = require("../util/admin");

exports.getAllShouts = (request, response) => {
  db.collection("shouts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let shouts = [];
      data.forEach(doc => {
        shouts.push({
          shoutId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return response.json(shouts);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};

exports.postOneShout = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Body must not be empty." });
  }

  const newShout = {
    body: request.body.body,
    userHandle: request.body.handle,
    createdAt: new Date().toISOString()
  };
  db.collection("shouts")
    .add(newShout)
    .then(doc => {
      const resShout = newShout;
      resShout.shoutId = doc.id;
      response.json(resShout);
    })
    .catch(err => {
      response.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
