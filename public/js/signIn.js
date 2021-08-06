let googleUser;

const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  // console.log(provider)
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;
    

    // The signed-in user info.
    var user = result.user;
    userCheck();
    console.log(user + " has signed in!");
    // window.location = 'mainpage.html';
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    const err = {
      errorCode,
      errorMessage,
      email,
      credential
    };
    console.log(err);
  });
}

const userCheck = (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
            checkIfRegistered(user);
        } 
        
        else {
            // If not logged in, navigate back to login page.
            window.location = 'index.html'; 
        }
  });
}

const checkIfRegistered = (user) => {
    const usersRef = firebase.database().ref(`users`);

    usersRef.child(`${googleUser.uid}`).get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log("We are registered!")
            window.location = "mainpage.html"
        } 
        
        else {
            console.log("not registered :(");
            window.location = "register.html"
        }

        }).catch((error) => {
            console.error(error);
        })
}
