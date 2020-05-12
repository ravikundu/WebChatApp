var mainApp = {};

var uid = null;
var userName = null; 

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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        uid = user.uid;
        userName = user.displayName;
        //displayAllMessage();
    }else{
        // redirect to login page
        uid = null;
        window.location.replace("index.html");
    }
});

function logOut(){
    firebase.auth().signOut();
}

mainApp.logOut = logOut;

/*
function displayAllMessage(){
    firebase.database().ref('messages').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var msg = childSnapshot.val().message;
            var sender = childSnapshot.val().sender;
            var msgID = childSnapshot.key;
            addToList(msg,sender,msgID);
        });
    });
}*/

document.addEventListener("keyup",function(event){
    const input = document.getElementById("msg");
    if(event.keyCode == 13){
        const msg = input.value;
        if(msg){
            //addToList(msg,userName);
            addToFirebase(msg,userName);
        }
        input.value = "";
    }
});

function addMSG(){
    const input = document.getElementById("msg");
    const msg = input.value;
    if(msg){
        //addToList(msg,userName);
        addToFirebase(msg,userName);
    }
    input.value = "";
}

firebase.database().ref("messages").on("child_added", function (snapshot) {
    var msg = snapshot.val().message;
    var sender = snapshot.val().sender;
    var msgID = snapshot.key;
    addToList(msg,sender,msgID);
    console.log("child added using child_added");
});

function addToList(msg,sender,msgID){
    const list = document.getElementById("list");

    if(sender == userName){
        const text = `<li class="item" id="${msgID}">
                        <h6 class="msg_P"><div class="msg_P_div">${sender} : ${msg}</div></h6>
                        <button class="deleteButton" type="submit" data-id="${msgID}" value="" onclick="removeMSG(this)"><img class="deleteButtonImg" src="delete.jpg"></button>
                      </li>`
        const position =  "afterbegin";

        list.insertAdjacentHTML(position,text);
    }else{
        const text = `<li class="item" id="${msgID}">
                        <h6 class="msg_P"><div class="msg_P_div">${sender} : ${msg}</div></h6>
                      </li>`
        const position =  "afterbegin";

        list.insertAdjacentHTML(position,text);
    }
    //list.appendChild(text);
}

function addToFirebase(msg,sender){
    firebase.database().ref("messages").push().set({
        "sender": sender,
        "message": msg
    });
}

function removeMSG(self){
    var messageId = self.getAttribute("data-id");
    removeFromList(messageId);
    removeFromFirebase(messageId);
}

firebase.database().ref("messages").on('child_removed', snapshot => {
    var msg = snapshot.val().message;
    var sender = snapshot.val().sender;
    var msgID = snapshot.key;
    console.log("Message removed : " + msgID);
    removeFromList(msgID);
});

function removeFromList(id){
    const list = document.getElementById("list");
    console.log(document.getElementById(id));
    list.removeChild(document.getElementById(id));
}

function removeFromFirebase(msgID){
    firebase.database().ref("messages").child(msgID).remove();
}
