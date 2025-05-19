// index.js

// ✅ Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ✅ Correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPYMY0MqJw26glM6LBW1V_gK12N-ZNnUE",
  authDomain: "second-level-project-f1636.firebaseapp.com",
  projectId: "second-level-project-f1636",
  storageBucket: "second-level-project-f1636.appspot.com",
  messagingSenderId: "540248004388",
  appId: "1:540248004388:web:f80106d27e2e5dbe4305b1"
};

// ✅ Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(app);

// ✅ DOM Elements
const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const formSuccess = document.getElementById("form-success");

// ✅ Form Submit Listener
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset previous errors
  emailError.textContent = "";
  passwordError.textContent = "";
  formSuccess.textContent = "";
 
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  try {
    // Validate inputs
    let valid = true;
    if (!email) {
      emailError.textContent = "Email is required.";
      valid = false;
    }
    if (!password) {
      passwordError.textContent = "Password is required.";
      valid = false;
    }
    if (!valid) return;

    // 🔐 Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(user);
    
    // console.log("Login Successful"user);
    
    // 🛡 Check if email is verified
    // if (!user.emailVerified) {
    //   formSuccess.style.color = "red";
    //   formSuccess.textContent = "Please verify your email before logging in.";
    //   return;
    // }

    // 🔍 Get user role from Firestore
    // const userDoc = await getDoc(doc(db, "user", user.uid));
    // if (!userDoc.exists()) {
    //   throw new Error("User document not found");
    // }
    // const role = userDoc.data().role;

    // ✅ Show success
    formSuccess.style.color = "green";
    formSuccess.textContent = "Sign-in successful! Redirecting...";

    window.location.href = "../Users Page/index.html";

    // 🔁 Redirect based on role
    // setTimeout(() => {
    //   if (role === "doctor") {
    //     window.location.href = "../Users Page/index.html";
    //   } else {
    //     window.location.href = "../Users Page/index.html";
    //   }
    // }, 1500);

  } catch (error) {
    const errorCode = error.code;
    console.error("Login error:", error.message);

    if (errorCode === "auth/user-not-found") {
      emailError.textContent = "No account found with this email.";
    } else if (errorCode === "auth/wrong-password") {
      passwordError.textContent = "Incorrect password.";
    } else if (errorCode === "auth/invalid-email") {
      emailError.textContent = "Invalid email address.";
    } else if (errorCode === "auth/invalid-credential") {
      passwordError.textContent = "Invalid credentials.";
    } else {
      formSuccess.style.color = "red";
      formSuccess.textContent = "Login failed: " + error.message;
    }
  }
});

