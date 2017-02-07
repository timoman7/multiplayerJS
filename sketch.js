var currentUser;
var users;
var started = false;
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
function checkUsers(){
	firebase.database().ref('/users/').once('value').then(
	  function(snapshot){
	    users = snapshot.val();
	  }
	);
}
function addVar(newVar,value){
	globalVariables[newVar]=value;
}
function updateData(x,y,code,draw2Code){
	if(draw2Code){
		firebase.database().ref('/users/'+currentUser.uid).set({
			x:x,
			y:y,
			name:currentUser.displayName,
			draw2Code:draw2Code,
			code:code,
			globalVariables:globalVariables
		});
	}else{
		firebase.database().ref('/users/'+currentUser.uid).set({
			x:x,
			y:y,
			name:currentUser.displayName,
			code:code,
			globalVariables:globalVariables
		});
	}
}
var triedToUpdate=true;
function updateCode(){
	//document.getElementById("myCode").value=document.getElementById("myCode").value.replace(/var/g,);
	triedToUpdate=true;
}
var can;
var myCode;
var errCon;
var updateBtn;
var x=0;
var y=0;
function setup() {
	can = createCanvas(800,800);
	var defCode = "function draw2(){\nif(keyIsDown(LEFT_ARROW)){\nx-=2;\n}\nif(keyIsDown(RIGHT_ARROW)){\nx+=2;\n}\nif(keyIsDown(DOWN_ARROW)){\ny+=2;\n}\n\nif(keyIsDown(UP_ARROW)){\ny-=2;\n}\n}";
	if(currentUser){
		if(users[currentUser.uid].code !== defCode){
			defCode = users[currentUser.uid].code;
		}
		if(users[currentUser.uid].x !== x){
			x = users[currentUser.uid].x;
		}
		if(users[currentUser.uid].y !== y){
			y = users[currentUser.uid].y;
		}
	}
	myCode = createInput(defCode);
	myCode.id("myCode");
	myCode.elt.outerHTML=myCode.elt.outerHTML.replace(/input/g,"textarea")+"</textarea>";
	myCode.elt=document.getElementById("myCode");
	document.getElementById("myCode").value=defCode;
	myCode.size(400,400);
	myCode.position(820,0);
	updateBtn = createButton("Update");
	updateBtn.position(820,420);
	updateBtn.mouseClicked(updateCode);
	errCon = createP();
	errCon.position(820,440);
	errCon.hide();
}
function draw() {
	background(200);
	if(!started){
		if(currentUser){
			if(users[currentUser.uid].code !== defCode){
				defCode = users[currentUser.uid].code;
			}
			if(users[currentUser.uid].x !== x){
				x = users[currentUser.uid].x;
			}
			if(users[currentUser.uid].y !== y){
				y = users[currentUser.uid].y;
			}
		}
	}
	if(triedToUpdate){
		try{
			if(document.getElementById("myCode").value.includes("function draw2()")){
				var curV=document.getElementById("myCode").value;
				window.eval(curV.substr(0,curV.indexOf("function draw2()")));
				var newDraw2=curV.substr(curV.indexOf("function draw2()"),curV.length);
				if(currentUser){
					updateData(x,y,curV.substr(0,curV.indexOf("function draw2()"),newDraw2);
				}
			}else{
				window.eval(document.getElementById("myCode").value);
				if(currentUser){
					updateData(x,y,document.getElementById("myCode").value);
				}
			}
		}catch(err){
			triedToUpdate=false;
			errCon.show();
			errCon.html("Error: "+err+"<br>"+errCon.html())
		}
	}
	checkUsers();
	for(var i in users){
		ellipse(users[i].x,users[i].y,20,20);
		text(users[i].name,users[i].x,users[i].y);
		if(i !== uid){
			window.eval(users[i].draw2Code);
		}
	}
	if(draw2){
		draw2();
	}
	started = true;
}
