import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore(app);

export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signin = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signout = () => {
  return signOut(auth);
};

// Custom Hook
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: any) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
};

// storage
export const upload = async (file: any, name: string) => {
  const fileRef = ref(storage, name + ".png");
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  return photoURL;
};

export const storeData = async (
  currentUser: any,
  name: string,
  photoURL: string
) => {
  const now = new Date();
  const localTime = now.toLocaleTimeString();
  const docRef = await addDoc(collection(db, "snapbook"), {
    uid: currentUser.uid,
    name,
    photoURL,
    localTime,
  });
  console.log("Document written with ID: ", docRef.id);
};

export const fetchData = async () => {
  return await getDocs(collection(db, "snapbook")).then((querySnapshot) => {
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  });
};

export const deleteData = async (id: string) => {
  await deleteDoc(doc(db, "snapbook", id));
};

export const editData = async (id: string, name: string, photoURL?: string) => {
  const now = new Date();
  const localTime = now.toLocaleTimeString();
  const docRef = doc(db, "snapbook", id);

  if (photoURL) {
    await updateDoc(docRef, {
      name,
      photoURL,
      localTime,
    });
  } else {
    await updateDoc(docRef, {
      name,
      localTime,
    });
  }
  console.log("Document edited with ID: ", docRef.id);
};
