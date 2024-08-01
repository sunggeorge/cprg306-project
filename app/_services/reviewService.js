import { db, storage } from "../_utils/firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion, getDocs, deleteDoc, arrayRemove } from "firebase/firestore/lite";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

export const addReview = async (userId, recipeId, reviewData) => {
  const photoURLs = await Promise.all(reviewData.photos.map(file => uploadFile(file)));
  const reviewsRef = collection(db, "reviews");
  const newReview = await addDoc(reviewsRef, {
    recipeID: recipeId,
    authorID: userId,
    comment: reviewData.comment,
    rating: reviewData.rating,
    createdAt: new Date(),
    photos: photoURLs
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
export const getReviews = async () => {
  try {
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    return reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting reviews: ", error);
    throw new Error("Failed to get reviews");
  }
};

export const updateReview = async (reviewId, updatedData) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, updatedData);
  } catch (error) {
    console.error("Error updating review: ", error);
    throw new Error("Failed to update review");
  }
};

export const deleteReview = async (reviewId, userId, recipeId, photoURLs) => {
  try {
    // Delete the review document
    const reviewRef = doc(db, "reviews", reviewId);
    await deleteDoc(reviewRef);

    // Remove the review ID from the recipe document
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, {
      reviews: arrayRemove(reviewId),
    });

    // Remove the review ID from the user's reviewedRecipes array
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      reviewedRecipes: arrayRemove(reviewId),
    });

    // Delete associated photos from Firebase Storage
    await Promise.all(photoURLs.map(async (photoURL) => {
      const photoRef = ref(storage, photoURL);
      await deleteObject(photoRef);
    }));

    console.log(`Review ${reviewId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
};

