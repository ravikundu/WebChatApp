var loginApp = {};

var uid = null;
var username = null; 

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCcFrz4T75edfQ4AuXONAFwpPEGSkLf2bA",
    authDomain: "web-chat-app-be9f7.firebaseapp.com",
    databaseURL: "https://web-chat-app-be9f7.firebaseio.com",
    projectId: "web-chat-app-be9f7",
    storageBucket: "web-chat-app-be9f7.appspot.com",
    messagingSenderId: "1084555851316",
    appId: "1:1084555851316:web:4e21c35cb158330cb93c61",
    measurementId: "G-YZMTK5PJMZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

function login(){
    username = document.getElementById("username").value;
    console.log("Checking user....");
    firebase.database().ref('users').once('value').then(function(snapshot) {
        var userFound = false;
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().username == username){
              userFound = true;
                console.log("User Logged In");
                //location.replace("booth.html");
                localStorage.setItem("uid",childSnapshot.key);
                localStorage.setItem("username",username);
                window.document.location = "booth.html";
            }
        });

        if(!userFound){
          console.log("No such user Exists");
          console.log("Creating a new user.");
          uid = firebase.database().ref("users").push().key;
          console.log("UID : " + uid);
          try{
            firebase.database().ref("users/"+uid).set({
              "username": username,
            });
            localStorage.setItem("uid",uid);
            localStorage.setItem("username",username);
            console.log("User created.");
            window.document.location = "booth.html";
          }catch(err){
            console.log(err);
          }
        }
    });
    console.log("firebaseNot");
}

loginApp.login = login;

document.addEventListener("keyup",function(event){
  if(event.keyCode == 13){
    console.log("Login initiated...");
    login();
  }
});
