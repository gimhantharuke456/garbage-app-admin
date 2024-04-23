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

const scheduleCollectionName = "garbage_schedules";

// Fetch all schedules
export const fetchSchedules = async () => {
  try {
    const snapshot = await getDocs(collection(db, scheduleCollectionName));
    const schedules = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return schedules;
  } catch (err) {
    throw new Error(`Failed to fetch schedules: ${err.message}`);
  }
};

// Fetch schedules by status
export const fetchSchedulesByStatus = async (status) => {
  const q = query(
    collection(db, scheduleCollectionName),
    where("status", "==", status)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new schedule
export const addSchedule = async (scheduleData) => {
  try {
    const docRef = await setDoc(
      doc(collection(db, scheduleCollectionName)),
      scheduleData
    );
    return { ...scheduleData, id: docRef.id };
  } catch (err) {
    throw new Error(`Failed to add schedule: ${err.message}`);
  }
};

// Update an existing schedule
export const updateSchedule = async (id, scheduleData) => {
  try {
    await updateDoc(doc(db, scheduleCollectionName, id), scheduleData);
  } catch (err) {
    throw new Error(`Failed to update schedule: ${err.message}`);
  }
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  try {
    await deleteDoc(doc(db, scheduleCollectionName, id));
  } catch (err) {
    throw new Error(`Failed to delete schedule: ${err.message}`);
  }
};
