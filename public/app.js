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

        /*change hidden to style.display, Because the power of style.display attribute
         is more than the attribute of hidden.*/
        whenSignedIn.style.display = "initial";
        whenSignedOut.style.display = "none";
        userDetails.innerHTML = `<h3> Hello ${user.displayName}!</h3> `;
    } else {
        //not signed in
        whenSignedIn.style.display = "none";
        whenSignedOut.style.display = "initial";
        userDetails.innerHTML = "";
    }
});

const db = firebase.firestore();

const addHabit = document.getElementById("addHabit");
const habitsList = document.getElementById("habitsList");

/*get habit input vv*/
const inputHabit = document.querySelector("#input-habit")
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

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
                /*vvvvvvvvvvvvvvvvvvvv*/
                name: inputHabit.value,
                /*^^^^^^^^^^^^^^^^^^^^*/
                createdAt: serverTimestamp()
            });
            /*make a input habit fild clear after add habit*/
            inputHabit.value = "";
            /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        };



        unsubscribe = habitsRef
            .where("uid", "==", user.uid)

        /*add function below*/
        .onSnapshot(querySnapshot => {

            /*past the days' name here*/

            if (querySnapshot.docs.length) {
                document.querySelector('#habitsTableHead').innerHTML = `<div class="habit-holder habit-holder-habit">Habit</div>
                <div class="habit-holder">Mon</div>
                <div class="habit-holder">Tue</div>
                <div class="habit-holder">Wed</div>
                <div class="habit-holder">Thu</div>
                <div class="habit-holder">Fri</div>
                <div class="habit-holder">Sat</div>
                <div class="habit-holder">Sun</div>`
            }
            /*  ^^^^^^  */

            const items = querySnapshot.docs.map(doc => {
                return `<li>${doc.data().name}</li>`;
            });
            habitsList.innerHTML = items.join("");
        });
    }
});