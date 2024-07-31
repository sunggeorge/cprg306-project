import { db } from "../_utils/firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore/lite';

export const addReview = async (userId, recipeId, reviewData) => {
  const reviewsRef = collection(db, "reviews");
  const newReview = await addDoc(reviewsRef, {
    recipeID: recipeId,
    authorID: userId,
    ...reviewData,
    createdAt: new Date()
  });

  const recipeRef = doc(db, "recipes", recipeId);
  await updateDoc(recipeRef, {
    reviews: arrayUnion(newReview.id)
  });

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    reviewedRecipes: arrayUnion(newReview.id)
  });
};
