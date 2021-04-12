var admin = require("firebase-admin");
var serviceAccount = require("./go-daala-prod-firebase-adminsdk-kx7hm-c8b83fe095.json");

exports.isFcm =admin.initializeApp({
     
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://go-daala-prod-default-rtdb.firebaseio.com/"
});
