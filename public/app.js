const auth = firebase.auth();

//Selectors
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutbtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutbtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        //signed in

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
const habitsList = document.querySelector("#tbody")
const inputHabit = document.querySelector("#input-habit")
    
let habitsRef;
let unsubsribe;
let remove;


auth.onAuthStateChanged(user => {
    if (user) {
        habitsRef = db.collection("habits");

        remove = (uid) => {
            db.collection('habits').doc(uid).delete()
        } 

        addHabit.onclick = (e) => {
            e.preventDefault()
            const {serverTimestamp} = firebase.firestore.FieldValue;
            db.collection('habits').doc(inputHabit.value).set({
                uid: user.uid,
                name: inputHabit.value,
                createdAt: serverTimestamp()              
                
            });
            inputHabit.value = "";
           
        };

     

        unsubscribe = habitsRef
            .where("uid", "==", user.uid)
       
        .onSnapshot(querySnapshot => {

            const items = querySnapshot.docs.map(doc => {   
                
                const {name} = doc.data();                             
                               
                return `<tr>          
                                
                <td id="habitBox"><button id="removeButton" class="removeButton" onclick="remove('${name}')">🗑️</button>${name}</td>
                <td>
                    <input type="checkbox" class="checkbox" id="check1${name}">
                    <label for="check1${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check2${name}">
                    <label for="check2${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check3${name}">
                    <label for="check3${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check4${name}">
                    <label for="check4${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check5${name}">
                    <label for="check5${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check6${name}">
                    <label for="check6${name}"></label>
                </td>
                <td>
                    <input type="checkbox" class="checkbox" id="check7${name}">
                    <label for="check7${name}"></label>
                </td>

            </tr>`;
           
            });
            habitsList.innerHTML = items.join("");
           
        });
    }
});