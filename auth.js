module.exports = function(config) {
  const Firestore = require("@google-cloud/firestore");
  const firestore = new Firestore({
    projectId: config.projectId,
    keyFilename: config.keyFilename
  });

  function getUser(reqbody, callback) {
    var user;
    var error = null;
    console.log(reqbody.username);
    var user_query = firestore
      .collection("user-data")
      .doc(reqbody.username)
      .get()
      .then(account => {
        if (reqbody.password === account.data().password) {
          callback(error, account.data());
        } else {
          error = new Error("Password not valid");
          callback(error, null);
        }
      })
      .catch(e => {
        error = e;
        callback(error, user);
      });
  }
  return {
    getUser: getUser
  };
};
