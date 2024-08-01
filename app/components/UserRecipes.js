"use client";
import { useEffect, useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import AddReview from "./AddReview";
import ReviewList from "./ReviewList";
import RecipeList from "./RecipeList";
import styles from './UserRecipes.module.css';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);
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

  useEffect(() => {
    const fetchReviews = async () => {
      if (recipes.length > 0) {
        const allReviews = [];
        for (const recipe of recipes) {
          const q = query(collection(db, "reviews"), where("recipeID", "==", recipe.id));
          const querySnapshot = await getDocs(q);
          const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          allReviews.push(...reviewsData);
        }
        setReviews(allReviews);
      }
    };

    fetchReviews();
  }, [recipes]);

  const handleNewReview = (review) => {
    setReviews(prevReviews => [review, ...prevReviews]);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Recipes</h1>
      <RecipeList recipes={recipes} />
      {/* Render each recipe and its reviews */}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
          <AddReview recipeId={recipe.id} onNewReview={handleNewReview} />
          <ReviewList recipeId={recipe.id} reviews={reviews.filter(review => review.recipeID === recipe.id)} onDeleteReview={handleDeleteReview} />
        </div>
      ))}
    </div>
  );
};

export default UserRecipes;
