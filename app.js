// Initialize Firebase
var config = {
  apiKey: "AIzaSyAzhVTVn6lKiY1m2OPYBiduIQTQh_8XjI8",
  authDomain: "train-schedule-b4e31.firebaseapp.com",
  databaseURL: "https://train-schedule-b4e31.firebaseio.com",
  projectId: "train-schedule-b4e31",
  storageBucket: "train-schedule-b4e31.appspot.com",
  messagingSenderId: "339412968128"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// initial values. what are the variables????
$("#check-train").on("click", function () {
  // grabs user inouts
  var trainName = $("#train-name-input").val().trim();
  var destinationName = $("#destination-input").val().trim();
  var firstTrainTime = $("#first-train-time-input").val().trim();
  var frequencyTrain = $("#frequency-input").val().trim();

  //create local temporary object for holding train data
  var newTrain = {
    name: trainName,
    destination: destinationName,
    firstTrain: firstTrainTime,
    frequency: frequencyTrain
  };

  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("Train added!");


  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");

  //this is to determine when the next train arrives

  return false;
});

//create a firebase event for adding trains to the database and a row in html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildkey) {
  console.log(childSnapshot.val());

  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  //if the first train is later than the current time, set arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    //calcuate the minutes until arrival using math
    //to calcuate the minutes until arrival, take current time in unix and subtract the firstTrainTime 
    //find the modulus (long division remainder) between the difference and frequency
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;

    //to calculate the arrival time, dd the tMinutes to the current time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  console.log("tMinutes: ", tMinutes);
  console.log("tArrival", tArrival);

  //add each train's data to the tbody in the html
  $(".table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});


  