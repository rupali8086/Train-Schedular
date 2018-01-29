
$(document).ready(function(){
  
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCHP4hygJ8Oudpxn_ymeNyAZZbiv9Wm368",
    authDomain: "project-1-47afa.firebaseapp.com",
    databaseURL: "https://project-1-47afa.firebaseio.com",
    projectId: "project-1-47afa",
    storageBucket: "project-1-47afa.appspot.com",
    messagingSenderId: "1052854905714"
};
firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Train Schedule
$("#addTrainBtn").on("click", function(event){
     
     event.preventDefault();

	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var dest = $("#destinationInput").val().trim();
	var firstTrain = moment($("#firstTrainInput").val().trim(),"HH:mm" ).format("X");
	var freq = $("#frequencyInput").val().trim();
	

	// Creates local "temporary" object for holding Train schedule 
	var newTrain = {
		name:  trainName,
		dest: dest,
		start: firstTrain,
		frequency: freq
	}

	// Uploads data to the database
	database.ref().push(newTrain);
	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.start);
	console.log(newTrain.frequency);

	// Alert
	alert("Train Schedule successfully added");

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});


// 3. Create Firebase event for addingtran to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().dest;
	var trainStart = childSnapshot.val().start;
	var trainFreq = childSnapshot.val().frequency;
	var key = childSnapshot.key;
	var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"
	var updateMe = "<button class='glyphicon glyphicon-edit' id=" + key + "></button>"

	// Train Info
	console.log(trainName);
	console.log(trainDest);
	console.log(trainStart);
	console.log(trainFreq);


   var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));
   //post current time to jumbotron for reference
   $("#current-status").html(moment(currentTime).format('dddd, MMMM Do YYYY, HH:mm:ss a'));

	// First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
  // Time apart (remainder)
  var timeRemainder = diffTime % trainFreq ;

  // Minute Until Train
  var minutes = trainFreq - timeRemainder;

  // Next Train
  var nextTrain = moment().add(minutes, "minutes");

  // Arrival time
  var nextTrainArrival = moment(nextTrain).format("hh:mm a");
	

  // Add each train's data into the table
  $("#trainTable > tbody").prepend("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainArrival  + "</td><td>" + minutes + "</td><td>"+ remove+ "</td><td>"+ updateMe + "</td></tr>");
  
  }, function(err) {
        console.log(err);
    });

    

    //on click command to delete key when user clicks the trash gliphicon
    $(document).on("click", ".glyphicon-trash", deleteTrain);

    function deleteTrain() {
    	alert("are you sure , you want delete this data ??");
    	var deleteKey = $(this).attr("id");
        database.ref().child(deleteKey).remove();
        location.reload();
    }

		   //  $(document).on("click", ".glyphicon-edit", updateTrain);
		   //  function updateTrain(childSnapshot,prevChildKey) {
		   //      var updateKey = $(this).attr("id");
		   //      updates[] =data;
		   //      database.ref().child(updateKey).update(updates);
		   //      reload_page();
		   // }
		  //    var ref = new firebase("https://console.firebase.google.com/u/0/project/project-1-47afa/database/project-1-47afa/data");
			// 	// Get the data on a post that has changed
			// database.ref().on("child_changed", function(childSnapshot) {
			 //   var changedPost = childSnapshot.val();
			 //  console.log("The updated post title is ");
			 //  });


    
});
