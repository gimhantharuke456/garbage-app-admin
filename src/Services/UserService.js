import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const collectionName = "garbaage_users";

export const fetchUsers = async () => {
  let users = [];
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    snapshot.docs.forEach((doc) => {
      users.push({
        ...doc.data(),
        id: doc.id,
      });
    });
  } catch (err) {
    throw new Error(err.message);
  }
  return users;
};

export const addUser = async (userData) => {
  const { email, ...rest } = userData;
  const password = "rider123"; // default password for rider

  try {
    // Create user with email and password in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Use the UID from the created Firebase Authentication user as the document ID in Firestore
    await setDoc(doc(db, collectionName, user.uid), {
      ...rest,
      email, // include the email in the Firestore document if needed
    });

    return user; // You might want to return the user object for further use
  } catch (err) {
    // Handle errors from Firebase Authentication and Firestore appropriately
    throw new Error(err.message);
  }
};

export const updateUser = async (id, userData) => {
  try {
    const userRef = doc(db, collectionName, id);
    await setDoc(userRef, userData, { merge: true });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const userRef = doc(db, collectionName, id);
    await deleteDoc(userRef);
  } catch (err) {
    throw new Error(err.message);
  }
};
