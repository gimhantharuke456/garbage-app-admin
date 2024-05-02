import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const scheduleCollectionName = "normal_schedules";

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

export const fetchScheduleById = async (id) => {
  try {
    const docRef = doc(db, scheduleCollectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Schedule not found");
    }
  } catch (err) {
    throw new Error(`Failed to fetch schedule: ${err.message}`);
  }
};

export const addSchedule = async (scheduleData) => {
  try {
    await setDoc(doc(collection(db, scheduleCollectionName)), scheduleData);
  } catch (err) {
    throw new Error(`Failed to add schedule: ${err.message}`);
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    await updateDoc(doc(db, scheduleCollectionName, id), scheduleData);
  } catch (err) {
    throw new Error(`Failed to update schedule: ${err.message}`);
  }
};

export const deleteSchedule = async (id) => {
  try {
    await deleteDoc(doc(db, scheduleCollectionName, id));
  } catch (err) {
    throw new Error(`Failed to delete schedule: ${err.message}`);
  }
};
