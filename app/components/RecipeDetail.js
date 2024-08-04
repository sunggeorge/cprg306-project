"use client";
import { useEffect, useState } from "react";
import { doc, getDoc,collection,query,where,getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import ReviewList from "./ReviewList";
import AddReview from "./AddReview";
import Link from 'next/link';

const RecipeDetail = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, "recipes", recipeId);
      const recipeSnap = await getDoc(recipeRef);
      if (recipeSnap.exists()) {
        setRecipe({ id: recipeSnap.id, ...recipeSnap.data() });
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleReviews = async () => {
    const q = query(collection(db, "reviews"), where("recipeID", "==", recipeId));
    const querySnapshot = await getDocs(q);
    const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setReviews(reviewsData);
  };
  useEffect(() => {
    if (recipeId) {
      handleReviews();
    }
  }, [recipeId]);

  const onNewReview = (newReview) => {
    // Update the local state with the new review
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const onDeleteReview = async (reviewId) => {
    // Function to handle post-delete actions
    try {
      console.log(`Review with ID: ${reviewId} has been deleted`);
      // Update the local state by removing the deleted review
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error handling post-delete actions:", error);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      {recipe.picture && (
        <img src={recipe.picture} alt={recipe.title} className="mb-4 mx-auto" style={{ height: "600px", width: "auto"}}/>
      )}
      <p className="mb-4">{recipe.instructions}</p>
      <h2 className="text-2xl font-bold mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-4">
        {Array.isArray(recipe.ingredients) ? (
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))
        ) : (
          <li>No ingredients available</li>
        )}
      </ul>
      <Link href={`/recipes/edit/${recipe.id}`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Edit Recipe
      </Link>
   
      <ReviewList reviews={reviews} setReviews={setReviews} recipeId={recipe.id} onDeleteReview={onDeleteReview} />
      <div className="mt-8">
        <AddReview recipeId={recipe.id} onNewReview={onNewReview} />
      </div>
    </div>
  );
};

export default RecipeDetail;
