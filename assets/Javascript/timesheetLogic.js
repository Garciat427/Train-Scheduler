//Firebase Config and initialize
var config = {
  apiKey: "AIzaSyB-RN6dHFkl9DYeEZ0XsqUGX1RLR-rq5uY",
    authDomain: "trainsch-garciat427.firebaseapp.com",
    databaseURL: "https://trainsch-garciat427.firebaseio.com",
    projectId: "trainsch-garciat427",
    storageBucket: "",
    messagingSenderId: "480963392666",
    appId: "1:480963392666:web:e4aaae1160d43596"
};

firebase.initializeApp(config);

var database = firebase.database();

// Add Train btn Event
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDes = $("#destination-input").val().trim();
  var trainFirst = (moment($("#first-train-input").val().trim(),"HH:mm").format("HH:mm"));
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDes,
    firstTrain: trainFirst,
    frequency: trainFreq
  };

  // Uploads train data obj to the database
  database.ref().push(newTrain);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirst = childSnapshot.val().firstTrain;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  var tFrequency = trainFrequency;
  var firstTime = trainFirst;
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  
  var currentTime = moment();

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(moment(nextTrain).format("hh:mm a")),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

$(document).ready(function() {
  // auto refresh page after 30 seconds
  setInterval('refreshPage()', 30000);
});

function refreshPage() { 
  location.reload(); 
}
