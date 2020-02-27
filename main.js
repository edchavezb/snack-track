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
  for(var i = 0; i < snackArray.length; i++){
    var snackName = snackArray[i].name
    var snackAmount = snackArray[i].amount
    var newSnack = $("<div>");
    newSnack.html($("#template").html());
    console.log(newSnack);
    newSnack.addClass("new-snack row mt-1");
    newSnack.attr("amount", snackAmount);
    newSnack.attr("row", i);
    newSnack.find(".name-label").text(snackName);
    newSnack.find(".number").val(snackAmount);
    $(".display-routine").append(newSnack);
    calculateTotal();
    $(".total-display").show();
  }
});

function calculateTotal() {
  totalSnacks = 0;
  $(".new-snack").each(function(){
    totalSnacks += parseInt($(this).attr("amount"));
  });
  $(".snack-total").text("Total number of snacks: " + totalSnacks);
};

function rearrangeRows() {
  rows = 0;
  $(".new-snack").each(function(){
    $(this).attr("row", rows);
    rows++
  });
}

$("#add-item").on("click", function () {
  event.preventDefault();
  var name = $("#name-input").val();
  console.log($("#name-input").val().trim());
  var newSnack = $("<div>");
  newSnack.html($("#template").html());
  newSnack.addClass("new-snack row mt-1");
  newSnack.attr("amount", "1");
  newSnack.attr("row", rows);
  newSnack.find(".name-label").text(name);
  $(".display-routine").append(newSnack);
  $(".time-display").show();
  calculateTotal();
  rows++;
});

$(document).on("click", ".remove-item", function () {
  var parentSnackDiv = $(this).closest(".new-snack");
  parentSnackDiv.remove();
  database.ref('snacks').child(parentSnackDiv.attr("row")).remove();
  rearrangeRows();
  calculateTotal();
  console.log("removed!");
});

$(document).on("click", ".increase-amount", function () {
  var thisRow = $(this).closest(".new-snack");
  var amtAttr = parseInt(thisRow.attr("amount"));
  var newAmt = amtAttr + 1;
  thisRow.attr("amount", newAmt)
  var displayNumber = thisRow.find(".number");
  displayNumber.val(newAmt);
  calculateTotal();
});

$(document).on("click", ".decrease-amount", function () {
  var thisRow = $(this).closest(".new-snack");
  var amtAttr = parseInt(thisRow.attr("amount"));
  var newAmt = amtAttr - 1;
  thisRow.attr("amount", newAmt)
  var displayNumber = thisRow.find(".number");
  displayNumber.val(newAmt);
  calculateTotal();
});

$(document).on("change keyup", ".number", function() {
  var inputAmount = $(this).val();
  $(this).closest(".new-snack").attr("amount", inputAmount);
  calculateTotal();
  console.log("change");
});

$("#save-list").on("click", function () {
  $(".new-snack").each(function(){
    var snackNumber = $(this).attr("row");
    var snacksRef = database.ref("snacks");
    var newSnack = snacksRef.child(snackNumber);
    newSnack.set({
      name: $(this).find(".name-label").text(),
      amount: $(this).find(".number").val(),
    });
  });

  $(".saved-alert").slideToggle();
});


$("#discard").on("click", function () {
  resetList();
});

$(".saved-alert").on("click", function () {
  $(".saved-alert").slideToggle();
});

function resetList(){
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
