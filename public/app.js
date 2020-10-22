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