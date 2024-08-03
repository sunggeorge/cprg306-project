"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import ReviewList from "./ReviewList";
import AddReview from "./AddReview";
import Link from 'next/link';

const RecipeDetail = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);

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
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <Link href={`/recipes/edit/${recipe.id}`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Edit Recipe
      </Link>
   
      <ReviewList recipeId={recipe.id} />
      <div className="mt-8">
        <AddReview recipeId={recipe.id} />
      </div>
    </div>
  );
};

export default RecipeDetail;
