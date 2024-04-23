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
import { db } from "../firebaseConfig";

const requestCollectionName = "garbage_requests";

export const fetchRequests = async () => {
  try {
    const snapshot = await getDocs(collection(db, requestCollectionName));
    const requests = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return requests;
  } catch (err) {
    throw new Error(`Failed to fetch requests: ${err.message}`);
  }
};

export const fetchRequestsPending = async () => {
  const q = query(
    collection(db, "garbage_requests"),
    where("status", "==", "Pending")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addRequest = async (requestData) => {
  try {
    const docRef = await setDoc(doc(db, requestCollectionName), requestData);
    return { ...requestData, id: docRef.id };
  } catch (err) {
    throw new Error(`Failed to add request: ${err.message}`);
  }
};

export const updateRequest = async (id, requestData) => {
  try {
    await updateDoc(doc(db, requestCollectionName, id), requestData);
  } catch (err) {
    throw new Error(`Failed to update request: ${err.message}`);
  }
};

export const deleteRequest = async (id) => {
  try {
    await deleteDoc(doc(db, requestCollectionName, id));
  } catch (err) {
    throw new Error(`Failed to delete request: ${err.message}`);
  }
};
