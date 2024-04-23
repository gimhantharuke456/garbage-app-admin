import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const reviewCollectionName = "garbage_reviews";

export const fetchAllReviews = async () => {
  try {
    const snapshot = await getDocs(collection(db, reviewCollectionName));
    const reviews = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return reviews;
  } catch (err) {
    throw new Error(`Failed to fetch reviews: ${err.message}`);
  }
};

export const fetchReviewsByRiderId = async (riderId) => {
  try {
    const q = query(
      collection(db, reviewCollectionName),
      where("riderId", "==", riderId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    throw new Error(
      `Failed to fetch reviews for rider ${riderId}: ${err.message}`
    );
  }
};

export const addReview = async (reviewData) => {
  try {
    const docRef = await addDoc(
      collection(db, reviewCollectionName),
      reviewData
    );
    return { ...reviewData, id: docRef.id };
  } catch (err) {
    throw new Error(`Failed to add review: ${err.message}`);
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    await updateDoc(doc(db, reviewCollectionName, id), reviewData);
  } catch (err) {
    throw new Error(`Failed to update review: ${err.message}`);
  }
};

export const deleteReview = async (id) => {
  try {
    await deleteDoc(doc(db, reviewCollectionName, id));
  } catch (err) {
    throw new Error(`Failed to delete review: ${err.message}`);
  }
};
