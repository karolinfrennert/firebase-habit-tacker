const auth = firebase.auth();
console.log(auth);
//Selectors 
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutbtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutbtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    //signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3> Hello ${user.displayName}!</h3> <p>How are you feeling today?</p>`
  }
  else {
    //not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }

});

const db = firebase.firestore();

const addHabit = document.getElementById('addHabit');
const habitsList = document.getElementById('habitsList');

let habitsRef;
let unsubsribe;