import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";
import * as util from "../viewpage/util.js";

import * as Elements from "../viewpage/elements.js";
import * as Constants from "../model/constants.js";
import { routing } from "./route.js";
import * as WelcomeMessage from "../viewpage/welcome_message.js";

const auth = getAuth();
export let currentUser = null;
export function addEventListeners() {
  Elements.formSignIn.addEventListener("submit", async (e) => {
    e.preventDefault(); //keeps from refreshing the current page
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      Elements.modalSignIn.hide();
      console.log("signin");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      util.info("sign In Error", JSON.stringify(error), Elements.modalSignIn);
      if (Constants.DEV)
        console.log("sign in error: ${errorCode} | ${errorMessage}");
    }
  });

  Elements.menuSignOut.addEventListener("click", async () => {
    // sign out from Firebase Auth
    try {
      await signOut(auth);
      console.log("signout");
    } catch (e) {
      util.info("Sign Out Error", JSON.stringify(e));
      if (Constants.DEV) console.log("sign out error" + e);
    }
  });
  onAuthStateChanged(auth, authStateChangeObserver);
}

function authStateChangeObserver(user) {
  if (user) {
    currentUser = user;
    let elements = document.getElementsByClassName("modal-preauth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    elements = document.getElementsByClassName("modal-postauth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname, hash);
  } else {
    currentUser = null;
    let elements = document.getElementsByClassName("modal-preauth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
    elements = document.getElementsByClassName("modal-postauth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }

    Elements.root.innerHTML = WelcomeMessage.html;
  }
}
