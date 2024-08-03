import { db, storage } from "../_utils/firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion, getDocs } from "firebase/firestore/lite";
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

const deleteFile = async (fileUrls) => {
  try {
    console.log('fileUrls: ', fileUrls, Array.isArray(fileUrls));

    // Check if fileUrls is an array of strings
    if (!Array.isArray(fileUrls) || !fileUrls.every(url => typeof url === 'string')) {
      throw new TypeError('fileUrls must be an array of strings');
    }

    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/newtest-233a3.appspot.com/o/";

    for (const url of fileUrls) {
      // Extract the file path from the URL
      const filePath = decodeURIComponent(url.split(baseUrl)[1].split("?")[0]);

      // Create a storage reference from the file path
      const storageRef = ref(storage, filePath);
      
      // Delete the file
      await deleteObject(storageRef);
      console.log(`File deleted successfully: ${url}`);
    }
  } catch (error) {
    console.error("Error deleting file(s):", error);
    throw new Error("Failed to delete file(s)");
  }
};

export const addRecipe = async (userId, recipeData) => {
  if (Array.isArray(recipeData.pictureURL) && recipeData.pictureURL.length > 0) {
    const photoURLs = await Promise.all(recipeData.pictureURL.map(file => uploadFile(file)));
    recipeData.picture = photoURLs;
    delete recipeData.pictureURL;
  }
  
  const recipesRef = collection(db, "recipes");
  const newRecipe = await addDoc(recipesRef, {
    ...recipeData,
    authorID: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: []
  });

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    createdRecipes: arrayUnion(newRecipe.id)
  });

  const categoryRef = doc(db, "categories", recipeData.category);
  await updateDoc(categoryRef, {
    recipes: arrayUnion(newRecipe.id)
  });  
};

export const updateRecipe = async (recipeId, updatedData) => {
  try {
    console.log('pictureURL: ', updatedData.pictureURL, typeof updatedData.pictureURL);
    if (Array.isArray(updatedData.pictureURL) && updatedData.pictureURL.length > 0) {
      const photoURLs = await Promise.all(updatedData.pictureURL.map(file => uploadFile(file)));
      deleteFile(updatedData.picture);
      delete updatedData.pictureURL;
      updatedData.picture = photoURLs;
    } else {
      delete updatedData.picture;
      delete updatedData.pictureURL;
    }

    const recipeRef = doc(db, "recipes", recipeId);
    // Only update the specified fields
    const fieldsToUpdate = {
      ...updatedData,
      updatedAt: new Date(),
    };

    console.log('fieldsToUpdate: ', fieldsToUpdate);
    await updateDoc(recipeRef, fieldsToUpdate);
    console.log('Recipe updated successfully');
  } catch (error) {
    console.error('Error updating recipe: ', error);
  }
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