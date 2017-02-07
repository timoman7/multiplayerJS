var currentUser;
var users;
var globalVariables=[];
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
firebase.database().ref('/users/').once('value').then(
  function(snapshot){
    users = snapshot.val();
  }
);
function addVar(newVar,value){
	globalVariables[newVar]=value;
}
function updateData(x,y,code){
	firebase.database().ref('/users/'+currentUser.uid).set({
		x:x,
		y:y,
		code:code,
		globalVariables:globalVariables
	});
}
var triedToUpdate=false;
function updateCode(){
	triedToUpdate=true;
}
var can;
var myCode;
var updateBtn;
var x=0;
var y=0;
function setup() {
	can = createCanvas(800,800);
	myCode = createInput("x = 0;\ny = 0;\nfunction keyPressed(event){\nif(event.key == \"a\"){\nx-=5;\n}\nif(event.key == \"d\"){\nx+=5;\n}\nif(event.key == \"s\"){\ny+=5;\n}\nif(event.key == \"w\"){\ny-=5;\n}\n}\n","textarea");
	myCode.size(400,400);
	myCode.position(820,0);
	updateBtn = createButton("Update");
	updateBtn.position(820,420);
	updateBtn.mouseClicked(updateCode);
}
function draw() {
	background(200);
	if(triedToUpdate){
		try{
			eval(myCode.html());
			if(currentUser){
				updateData(x,y,myCode.html());
			}
		}catch(err){
			println("Error: "+err);
			triedToUpdate=false;
		}
	}
}
