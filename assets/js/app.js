
// current time
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, hh:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});



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
$("#addTrainBtn").on("click", function(){

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


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().dest;
	var trainStart = childSnapshot.val().start;
	var trainFreq = childSnapshot.val().frequency;

	// Train Info
	console.log(trainName);
	console.log(trainDest);
	console.log(trainStart);
	console.log(trainFreq);

	// Prettify the Train start
	var diffTime = moment().diff(moment.unix(trainStart), "minutes");
	var timeRemainder = moment().diff(moment.unix(trainStart), "minutes") % trainFreq ;
	var minutes = trainFreq - timeRemainder;
	var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
	

	// Add each train's data into the table
	$("#trainTable > tbody").prepend("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainArrival  + "</td><td>" + minutes + "</td></tr>");

});

