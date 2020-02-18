var firebaseConfig = {
  apiKey: "AIzaSyAWIC5LEttvfOGlQ3dqWSXznkJ8-4PWaaY",
  authDomain: "snack-track-862de.firebaseapp.com",
  databaseURL: "https://snack-track-862de.firebaseio.com",
  projectId: "snack-track-862de",
  storageBucket: "snack-track-862de.appspot.com",
  messagingSenderId: "633150016570",
  appId: "1:633150016570:web:40dc02fa5d59f094ddf903"
};

firebase.initializeApp(firebaseConfig);

var email, uid, emailVerified;
var totalTime = 0;


$(".time-display").hide();

var database = firebase.database();
var rows = 0;
var cycles = 1;
var schedule = [];
var currentCount = 0;
var uRoutinesArr = [];
var cycleTime;
var totalTime;
var snackArray;

database.ref('snacks').once('value').then(function(snapshot) {
  snackArray = snapshot.val();
  console.log(snackArray)
  console.log(currentCount)
  for(var i = 1; i < snackArray.length; i++){
    var rows = snackArray.length
    var snackName = snackArray[i].name
    var snackAmount = snackArray[i].amount
    var newSnack = $("<div>");
    newSnack.html($("#template").html());
    console.log(newSnack);
    newSnack.addClass("new-exercise row mt-1");
    newSnack.attr("time", snackAmount);
    newSnack.attr("row", i);
    newSnack.find(".name-label").text(snackName);
    newSnack.find(".seconds").val(snackAmount);
    $(".display-routine").append(newSnack);
    $(".time-display").show();
    currentCount++
    console.log(currentCount)
  }
  console.log(currentCount)
});

database.ref().on("value", function(snapshot) {
  if (snapshot.child("snackCount").exists()) {
    currentCount = parseInt(snapshot.val().snackCount);
    rows = parseInt(snapshot.val().snackCount)
  }
  else {
    database.ref().set({snackCount: currentCount});
  }
});

function calculateTotal() {
  cycleTime = 0;
  $(".new-exercise").each(function(){
    cycleTime += parseInt($(this).attr("time"));
  });
  totalTime = cycleTime * cycles;
  $(".cycle-time").text("Total number of snacks: " + cycleTime);
};

$("#add-exercise").on("click", function () {
  event.preventDefault();
  rows++;
  var name = $("#name-input").val();
  console.log($("#name-input").val().trim());
  var newExercise = $("<div>");
  newExercise.html($("#template").html());
  newExercise.addClass("new-exercise row mt-1");
  newExercise.attr("time", "1");
  newExercise.attr("row", rows);
  newExercise.find(".name-label").text(name);
  $(".display-routine").append(newExercise);
  $(".time-display").show();
  calculateTotal();
});

$(document).on("change keyup", ".seconds", function() {
  var inputTime = $(this).val();
  $(this).closest(".new-exercise").attr("time", inputTime);
  calculateTotal();
  console.log("change");
});

$(document).on("click", "#remove-exercise", function () {
  var parentExercise = $(this).closest(".new-exercise");
  parentExercise.remove();
  calculateTotal();
  console.log("removed!");
});

$(document).on("click", "#add-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr + 1;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime);
  calculateTotal();
});

$(document).on("click", "#subtract-time", function () {
  var thisRow = $(this).closest(".new-exercise");
  var timeAttr = parseInt(thisRow.attr("time"));
  var newTime = timeAttr - 1;
  thisRow.attr("time", newTime)
  var displayTime = thisRow.find(".seconds");
  displayTime.val(newTime);
  calculateTotal();
});

$("#save-routine").on("click", function () {
  $(".new-exercise").each(function(){
    snackNumber = $(this).attr("row")
    snacksRef = database.ref("snacks");
    newSnack = snacksRef.child(snackNumber);
    newSnack.set({
      name: $(this).find(".name-label").text(),
      amount: $(this).find(".seconds").val(),
    });
  });
  var updatedCount = $(".new-exercise").length;
  console.log(updatedCount + " snacks stored in database");
  
  database.ref().update({snackCount: updatedCount});

  $(".saved-alert").slideToggle();
});


$("#discard").on("click", function () {
  resetRoutine();
});

$(".saved-alert").on("click", function () {
  $(".saved-alert").slideToggle();
});

function resetRoutine(){
  $("#routine-input").val("");
  $("#type-input option:first").attr("selected",true);
  $("#target-input option:first").attr("selected",true);
  $("input[id='dropdownCheck']").prop("checked", false);
  $(".cycles").val("1");
  $(".display-routine").empty();
  $(".time-display").hide();
  $("#name-input").val("");
  cycles = 1;
  rows = 0;
}
