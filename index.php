<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.3/firebase-databaes.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.14.3/firebase-analytics.js"></script>

<script>
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
  firebase.analytics();

  var myName = prompt("Enter your name");

</script>

<!-- Send Message -->

<!-- create a form to send message -->
<form onsubmit="return sendMessage();">
	<input id="message" placeholder="Enter message" autocomplete="off">

	<input type="submit">
</form>
	
<script>
	function sendMessage() {
		// get message
		var message = document.getElementById("message").value;

		// save in database
		firebase.database().ref("messages").push().set({
			"sender": myName,
			"message": message
		});

		// prevent form from submitting
		return false;
	}
</script>

<!-- Display Message -->

<!-- create a list -->
<ul id="messages"></ul>
	
<script>
	// listen for incoming messages
	firebase.database().ref("messages").on("child_added", function (snapshot) {
		var html = "";
		// give each message a unique ID
		html += "<li id='message-" + snapshot.key + "'>";
		// show delete button if message is sent by me
		if (snapshot.val().sender == myName) {
			html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
				html += "Delete";
			html += "</button>";
		}
		html += snapshot.val().sender + ": " + snapshot.val().message;
		html += "</li>";

		document.getElementById("messages").innerHTML += html;
	});
</script>

<!-- Delete Message -->

<script>
    function deleteMessage(self) {
        // get message ID
        var messageId = self.getAttribute("data-id");

        // delete message
        firebase.database().ref("messages").child(messageId).remove();
    }

    // attach listener for delete message
    firebase.database().ref("messages").on("child_removed", function (snapshot) {
        // remove message node
        document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
    });
</script>