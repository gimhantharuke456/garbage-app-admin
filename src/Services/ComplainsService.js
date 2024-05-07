import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Make sure the path matches your actual config file

const complainsCollectionName = "complains";

export const fetchComplains = async () => {
  try {
    const snapshot = await getDocs(collection(db, complainsCollectionName));
    const complains = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return complains;
  } catch (err) {
    throw new Error(`Failed to fetch complains: ${err.message}`);
  }
};

export const fetchComplainsByStatus = async (status) => {
  const q = query(
    collection(db, complainsCollectionName),
    where("status", "==", status)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addComplain = async (complainData) => {
  try {
    const docRef = await setDoc(doc(db, complainsCollectionName), complainData);
    return { ...complainData, id: docRef.id }; // Note: setDoc does not automatically return the document reference ID
  } catch (err) {
    throw new Error(`Failed to add complain: ${err.message}`);
  }
};

export const updateComplain = async (id, complainData) => {
  try {
    await updateDoc(doc(db, complainsCollectionName, id), complainData);
  } catch (err) {
    throw new Error(`Failed to update complain: ${err.message}`);
  }
};

export const deleteComplain = async (id) => {
  try {
    await deleteDoc(doc(db, complainsCollectionName, id));
  } catch (err) {
    throw new Error(`Failed to delete complain: ${err.message}`);
  }
};
