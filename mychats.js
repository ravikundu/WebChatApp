var mychatsApp = {};
var uid = null;
var username = null;
var selectedExNum = null;
var userMsgRef = null;
var receiverMsgRef = null;
function initializeParams(){
    uid = localStorage.getItem("uid");
    username = localStorage.getItem("username");
    selectedExNum = localStorage.getItem("selectedExNum");

    if(selectedExNum == null){
        selectedExNum = 1;
    }
    if(username == null){
        username = "ravi";
    }
    if(uid == null){
        uid = "raviUID";
    }
    userMsgRef = "messages/"+uid+"/"+selectedExNum;
    receiverMsgRef = "messages/"+selectedExNum+"/"+uid;
    console.log(uid);
    console.log(username);
    console.log(selectedExNum);
    console.log(userMsgRef);
    console.log(receiverMsgRef);
    displayAllUsers();
}

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

document.addEventListener("keyup",function(event){
    const input = document.getElementById("msg");
    if(event.keyCode == 13){
        const msg = input.value;
        if(msg){
            console.log("Adding message initiated...");
            //addToList(msg,username);
            addToFirebase(msg,username);
        }
        input.value = "";
    }
});

mychatsApp.addMSG = addMSG;

function addMSG(){
    const input = document.getElementById("msg");
    const msg = input.value;
    if(msg){
        console.log("Adding message initiated...");
        //addToList(msg,username);
        addToFirebase(msg,username);
    }
    input.value = "";
}

function addToList(msg,sender,msgID){
    const list = document.getElementById("listofmsg");

    if(sender == username){
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

    const messageId = firebase.database().ref("messages/"+uid+"/"+selectedExNum).push().key;

    //for user
    firebase.database().ref("messages/"+uid+"/"+selectedExNum+"/"+messageId).set({
        "sender": sender,
        "message": msg
    });
    
    //for receiver
    firebase.database().ref("messages/"+selectedExNum+"/"+uid+"/"+messageId).set({
        "sender": sender,
        "message": msg
    });

    console.log("Message added to firebase.");
}

function removeMSG(self){
    var messageId = self.getAttribute("data-id");
    console.log("Removing message initiated...");
    //removeFromList(messageId);
    removeFromFirebase(messageId);
}

function removeFromList(id){
    const list = document.getElementById("list");
    console.log("Element removed : "+document.getElementById(id));
    list.removeChild(document.getElementById(id));
}

function removeFromFirebase(msgID){
    firebase.database().ref(userMsgRef).child(msgID).remove();
    firebase.database().ref(receiverMsgRef).child(msgID).remove();
    console.log("Message removed from firebase.");
}

function addlistenerToMSG(){
    firebase.database().ref(userMsgRef).on("child_added", function (snapshot) {
        console.log("Adding to list initiated....");
        var msg = snapshot.val().message;
        var sender = snapshot.val().sender;
        var msgID = snapshot.key;
        addToList(msg,sender,msgID);
        console.log("Message added using child_added to list.");
    });
    firebase.database().ref(userMsgRef).on('child_removed', snapshot => {
        var msg = snapshot.val().message;
        var sender = snapshot.val().sender;
        var msgID = snapshot.key;
        console.log("Message removed from list.");
        removeFromList(msgID);
    });
}

function displayAllUsers(){
    firebase.database().ref('users').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            console.log("Adding a user to list....");
            var userInt = childSnapshot.val().username;
            var userInstID = childSnapshot.key;
            if(userInstID != uid){
                addUser(userInt,userInstID);
            }
            console.log("User added : " + userInstID);
        });
    });
}
function addUser(userInst,userInstID){
    const list = document.getElementById("listofusers");

    const text = `<li class="item" id="${userInstID}">
                    <button type="submit" data-id="${userInstID}" value="${userInst}" onclick="removeMSG(this)">${userInst}</button>
                  </li>`
    const position =  "afterbegin";

    list.insertAdjacentHTML(position,text);
}

mychatsApp.changeUser = changeUser;

function changeUser(self){
    var userInstID = self.getAttribute("data-id");
    const list = document.getElementById("listofmsg");
    list.innerHTML = "";
    //displayAllMessage(userInstID);
    userMsgRef = "messages/"+uid+"/"+userInstID;
    receiverMsgRef = "messages/"+userInstID+"/"+uid;
    addlistenerToMSG();
}

function displayAllMessage(receiverID){
    firebase.database().ref('messages/'+uid+"/"+receiverID).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var msg = childSnapshot.val().message;
            var sender = childSnapshot.val().sender;
            var msgID = childSnapshot.key;
            addToList(msg,sender,msgID);
        });
    });
}
