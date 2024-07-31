import { db } from "../_utils/firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore/lite";

export const createUserDocument = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
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
