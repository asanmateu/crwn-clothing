import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChhtdB_wuVL4ek2N2wC_mnZT2TvD6bpmE",
  authDomain: "crwn-clothing-db-a259d.firebaseapp.com",
  projectId: "crwn-clothing-db-a259d",
  storageBucket: "crwn-clothing-db-a259d.firebasestorage.app",
  messagingSenderId: "329505756724",
  appId: "1:329505756724:web:6d449bdf7b19add50bdc61",
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(firebaseApp);

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInfo,
      });
    } catch (error) {
      console.error("Error creating user", error.message);
    }
  }

  return userDocRef;
};

export const signInWithGoogle = async () => {
  const { user } = await signInWithGooglePopup();
  await createUserDocumentFromAuth(user);
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};
