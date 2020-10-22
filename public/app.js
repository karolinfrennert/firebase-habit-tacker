const auth = firebase.auth();

//Selectors
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutbtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

//input field
//const inputHabit = document.getElementById('input-habit');

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutbtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    //signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3> Hello ${user.displayName}!</h3> `;
  } else {
    //not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

const db = firebase.firestore();

const addHabit = document.getElementById("addHabit");
const habitsList = document.getElementById("habitsList");

let habitsRef;
let unsubsribe;

auth.onAuthStateChanged(user => {
  if (user) {
    habitsRef = db.collection("habits");

    addHabit.onclick = (e) => {
      e.preventDefault()
      const { serverTimestamp } = firebase.firestore.FieldValue;

      habitsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp()
      });
    };

    unsubscribe = habitsRef
      .where("uid", "==", user.uid)
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
          return `<li>${doc.data().name}</li>`;
        });
        habitsList.innerHTML = items.join("");
      });
  }
});
