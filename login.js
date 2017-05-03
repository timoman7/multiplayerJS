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

firebase.auth().getRedirectResult().then(function(result){
	var user = result.user;
	var credential = result.credential;
	if(user===null){
		var provider;
		provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');
		firebase.auth().signInWithRedirect(provider);
	}else{
		currentUser = firebase.auth().currentUser;
	}
},function(error) {
	var email = error.email;
	var credential = error.credential;
});

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
