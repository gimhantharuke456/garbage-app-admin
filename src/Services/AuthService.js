import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      localStorage.setItem("email", email);
      return true;
    })
    .catch((err) => {
      throw Error(`${err}`);
    });
};

export const signout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw Error(`${error}`);
  }
};
