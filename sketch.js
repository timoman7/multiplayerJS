var currentUser;
var users;
firebase.auth().getRedirectResult().then(function(result){
		var user = result.user;
		var credential = result.credential;
		if(user===null){
			var provider;
			provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithRedirect(provider);
		}else{
			currentUser = firebase.auth().currentUser;
		}
	},function(error) {
    var email = error.email;
    var credential = error.credential;
});
firebase.database().ref('/users').once('value').then(
  function(snapshot){
    users = snapshot.val();
  }
);
function setup() {
  
}

function draw() {
  
}
