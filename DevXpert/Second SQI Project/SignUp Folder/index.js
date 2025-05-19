// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPYMY0MqJw26glM6LBW1V_gK12N-ZNnUE",
  authDomain: "second-level-project-f1636.firebaseapp.com",
  projectId: "second-level-project-f1636",
  storageBucket: "second-level-project-f1636.firebasestorage.app",
  messagingSenderId: "540248004388",
  appId: "1:540248004388:web:f80106d27e2e5dbe4305b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



document.getElementById("role").addEventListener("change", function () {
  const role = this.value;
  document.getElementById("doctor-details").style.display = role === "doctor" ? "block" : "none";
  document.getElementById("patient-details").style.display = role === "patient" ? "block" : "none";
});



document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("role").value;

  try {
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Collect additional data
    let profileData = {
      name,
      email,
      role,
      uid: user.uid,
    };

    if (role === "doctor") {
      profileData = {
        ...profileData,
        specialization: document.getElementById("specialization").value,
        license: document.getElementById("license").value,
        experience: document.getElementById("experience").value,
        hospital: document.getElementById("hospital").value
        // Profile pic upload can be added here later
      };
    } else if (role === "patient") {
      profileData = {
        ...profileData,
        age: document.getElementById("age").value,
        history: document.getElementById("medical-history").value,
        allergies: document.getElementById("allergies").value,
        medication: document.getElementById("current-medication").value,
        emergency: document.getElementById("emergency-contact").value
        // Profile pic upload can be added here later
      };
    }

    // Step 3: Save to Firestore
    await setDoc(doc(db, "users", user.uid), profileData);

    // Show success message
    document.getElementById("signup-success").textContent = "🎉 Account created successfully!";
    
    // Optional: Redirect after 2 sec
    setTimeout(() => {
      if (role === "doctor") {
        window.location.href = "../Users Page/index.html";
      } else {
        window.location.href = "../Users Page/index .html";
      }
    }, 2000);

  } catch (error) {
    document.getElementById("signup-success").style.color = "red";
    document.getElementById("signup-success").textContent = `❌ ${error.message}`;
  }
});



document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const spinner = document.getElementById("spinner");
  const successMsg = document.getElementById("signup-success");
  spinner.style.display = "block";
  successMsg.textContent = "";
  successMsg.style.color = "green";

  const name = document.getElementById("name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("role").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    document.querySelector("button[type='submit']").disabled = true;
    document.querySelector("button[type='submit']").disabled = false;



    let profileData = { name, email, role, uid: user.uid };

    if (role === "doctor") {
      profileData = {
        ...profileData,
        specialization: document.getElementById("specialization").value,
        license: document.getElementById("license").value,
        experience: document.getElementById("experience").value,
        hospital: document.getElementById("hospital").value
      };
    } else if (role === "patient") {
      profileData = {
        ...profileData,
        age: document.getElementById("age").value,
        history: document.getElementById("medical-history").value,
        allergies: document.getElementById("allergies").value,
        medication: document.getElementById("current-medication").value,
        emergency: document.getElementById("emergency-contact").value
      };
    }

    await setDoc(doc(db, "users", user.uid), profileData);

    successMsg.textContent = "🎉 Account created successfully!";
    spinner.style.display = "none";

    // setTimeout(() => {
    //   if (role === "doctor") {
    //     window.location.href = "../Users Page/index.html";
    //   } else {
    //     window.location.href = "../Users Page/index.html";
    //   }
    // }, 2000);

  }
   catch (error) {
    spinner.style.display = "none";
    successMsg.style.color = "red";
    successMsg.textContent = `❌ ${error.message}`;
  }
});


window.addEventListener("load", function () {
const loader = document.getElementById("loading-overlay");
if (loader) {
  loader.style.display = "none";
}
});

// Optional: Add any specific logic you might want for the loading animation
setTimeout(function () {
  document.querySelector('.loading-overlay').style.display = 'none';  // Hide the loading screen after 5 seconds
}, 6000); // You can adjust this duration as needed

