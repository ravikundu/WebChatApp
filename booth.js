var boothApp = {};
var username = localStorage.getItem("username");
document.getElementById("hValue").innerHTML = "Welcome : " + username;
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

function chat(self){
    const selectedExNum = self.getAttribute("id");
    localStorage.setItem("selectedExNum",selectedExNum);
    window.document.location = "chat.html";
}
function mychats(){
    window.document.location = "mychats.html"
}

boothApp.chat = chat;
boothApp.mychats = mychats;