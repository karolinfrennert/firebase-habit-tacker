"use strict";

var auth = firebase.auth(); //Selectors

var whenSignedIn = document.getElementById("whenSignedIn");
var whenSignedOut = document.getElementById("whenSignedOut");
var signInBtn = document.getElementById("signInBtn");
var signOutbtn = document.getElementById("signOutBtn");
var userDetails = document.getElementById("userDetails");
var provider = new firebase.auth.GoogleAuthProvider(); //input field
//const inputHabit = document.getElementById('input-habit');

signInBtn.onclick = function () {
  return auth.signInWithPopup(provider);
};

signOutbtn.onclick = function () {
  return auth.signOut();
};

auth.onAuthStateChanged(function (user) {
  if (user) {
    //signed in

    /*change hidden to style.display, Because the power of style.display attribute
     is more than the attribute of hidden.*/
    whenSignedIn.style.display = "initial";
    whenSignedOut.style.display = "none";
    userDetails.innerHTML = "<h3> Hello ".concat(user.displayName, "!</h3> ");
  } else {
    //not signed in
    whenSignedIn.style.display = "none";
    whenSignedOut.style.display = "initial";
    userDetails.innerHTML = "";
  }
});
var db = firebase.firestore();
var addHabit = document.getElementById("addHabit");
var habitsList = document.getElementById("habitsList");
/*get habit input vv*/

var inputHabit = document.querySelector("#input-habit");
/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

var habitsRef;
var unsubsribe;
auth.onAuthStateChanged(function (user) {
  if (user) {
    habitsRef = db.collection("habits");

    addHabit.onclick = function (e) {
      e.preventDefault();
      var serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
      habitsRef.add({
        uid: user.uid,

        /*vvvvvvvvvvvvvvvvvvvv*/
        name: inputHabit.value,

        /*^^^^^^^^^^^^^^^^^^^^*/
        createdAt: serverTimestamp()
      });
      /*make a input habit fild clear after add habit*/

      inputHabit.value = "";
      /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    };

    unsubscribe = habitsRef.where("uid", "==", user.uid)
    /*add function below*/
    .onSnapshot(function (querySnapshot) {
      /*past the days' name here*/
      if (querySnapshot.docs.length) {
        document.querySelector('#habitsTableHead').innerHTML = "<div class=\"habit-holder habit-holder-habit\">Habit</div>\n                <div class=\"habit-holder\">Mon</div>\n                <div class=\"habit-holder\">Tue</div>\n                <div class=\"habit-holder\">Wed</div>\n                <div class=\"habit-holder\">Thu</div>\n                <div class=\"habit-holder\">Fri</div>\n                <div class=\"habit-holder\">Sat</div>\n                <div class=\"habit-holder\">Sun</div>";
      }
      /*  ^^^^^^  */


      var items = querySnapshot.docs.map(function (doc) {
        return "<li>".concat(doc.data().name, "</li>");
      });
      habitsList.innerHTML = items.join("");
    });
  }
});