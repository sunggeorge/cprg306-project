import { db } from "../_utils/firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion, getDocs } from "firebase/firestore/lite";

export const addRecipe = async (userId, recipeData) => {
  const recipesRef = collection(db, "recipes");
  const newRecipe = await addDoc(recipesRef, {
    ...recipeData,
    authorID: userId,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: []
  });

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    createdRecipes: arrayUnion(newRecipe.id)
  });
};

export const updateRecipe = async (recipeId, updatedData) => {
  const recipeRef = doc(db, "recipes", recipeId);
  await updateDoc(recipeRef, {
    ...updatedData,
    updatedAt: new Date()
  });
};

export const getCategories = async () => {
  const categoriesRef = collection(db, "categories");
  const categorySnapshot = await getDocs(categoriesRef);
  const categories = categorySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return categories;
};