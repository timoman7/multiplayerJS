var currentUser;
var googleProvider;
setInterval(function(){
	if(currentUser){
		var logoutbtn = $(".Logout");
		logoutbtn.show();
		var loginbtns = $(".Login");
		loginbtns.hide();
	}else{
		var logoutbtn = $(".Logout");
		logoutbtn.hide();
		var loginbtns = $(".Login");
		loginbtns.show();
	}
},100);
function initApp(){
	// Result from Redirect auth flow.
	// [START getidptoken]
      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // [START_EXCLUDE]
        } else {
          // [END_EXCLUDE]
        }
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END getidptoken]
	
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          currentUser = firebase.auth().currentUser;
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          alert("Signed out");
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
}
function signInWithGoogle(){
	googleProvider = new firebase.auth.GoogleAuthProvider();
	googleProvider.addScope('https://www.googleapis.com/auth/plus.login');
	firebase.auth().signInWithRedirect(googleProvider);
}
function signOut(){
	firebase.auth().signOut().then(function() {
		location.reload();
	}).catch(function(error) {
	  // An error happened.
		console.log(error);
		alert("Somehow you screwed up logging out.");
	});
}
window.onload = function(){
	initApp();
};
