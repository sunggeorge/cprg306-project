import { db } from "../_utils/firebase";
import { collection, setDoc, getDoc, updateDoc, doc, arrayUnion } from "firebase/firestore/lite";

export const createUserDocument = async (user) => {
  console.log('Create user function called');
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.email,
      email: user.email,
      createdRecipes: [],
      reviewedRecipes: [],
      likedRecipes: []
    });
  }
};

export const updateUserDocument = async (userId, updatedData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updatedData);
};
