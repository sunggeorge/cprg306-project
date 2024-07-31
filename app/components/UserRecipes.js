"use client";
import { useEffect, useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import RecipeList from "./RecipeList";
import styles from './UserRecipes.module.css';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    if (user) {
      const fetchUserRecipes = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const recipesData = await Promise.all(
            userData.createdRecipes.map(async (recipeId) => {
              if (recipeId) { // Ensure recipeId is valid
                const recipeRef = doc(db, "recipes", recipeId);
                const recipeSnap = await getDoc(recipeRef);
                return { id: recipeSnap.id, ...recipeSnap.data() };
              }
              return null;
            })
          );
          setRecipes(recipesData.filter(recipe => recipe !== null)); // Filter out any null values
        }
      };

      fetchUserRecipes();
    }
  }, [user]);

  return (
    <div className={styles.userRecipes}>
      <h1>My Recipes</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default UserRecipes;
