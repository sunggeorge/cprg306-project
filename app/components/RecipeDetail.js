"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import ReviewList from "./ReviewList";
import AddReview from "./AddReview";
import Link from 'next/link';
import {getCategories} from "../_services/recipeService";
import { useUserAuth } from "../_utils/auth-context";
import { getUserName } from "../_services/userService";
import '@fortawesome/fontawesome-free/css/all.min.css';


const RecipeDetail = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const[categories, setCategories] = useState([]);
  const { user } = useUserAuth();
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = doc(db, "recipes", recipeId);
      const recipeSnap = await getDoc(recipeRef);
      if (recipeSnap.exists()) {
        setRecipe({ id: recipeSnap.id, ...recipeSnap.data() });
        setAuthorName(getUserName(recipeSnap.data().authorID)); 
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }
    fetchCategories();
  }, []);

  const categoryColors = {
    "Main Dishes": "bg-red-200 text-red-800",
    "Salads": "bg-yellow-200 text-blue-800",
    "Soups": "bg-green-200 text-green-800",
    "Side Dishes": "bg-blue-200 text-blue-800",
  };

// Format timestamps
const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const time = date.toLocaleString('en-US', options).replace(',', '');
  return `${year}-${month}-${day} ${time}`;
};

  let category, categoryColorClass;
  if (!recipe) {
     return <div>Loading...</div>;}
  else {
    category = categories.find(t => t.id === recipe.category);
    categoryColorClass = category ? categoryColors[category.name] : "bg-gray-200 text-gray-800";   
  }

  return (
    <div className="container mx-auto">
      <div>
      <h1 className="text-3xl font-bold mb-4 inline-block">
        {recipe.title}
        {category && (
          <span className={`inline-block ${categoryColorClass} text-xs px-2 py-1 rounded-full ml-2`}>
            {category.name}
          </span>
        )}
      </h1> 
      {authorName && <p><i className="fas fa-user text-blue-500 mr-1"></i> {authorName}</p>}     
      </div>

      <div className="text-sm text-gray-600 text-right mb-4">
      <p>Created At: {formatDate(recipe.createdAt)}</p>
      <p>Updated At: {formatDate(recipe.updatedAt)}</p>
    </div>
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
      {user && <Link href={`/recipes/edit/${recipe.id}`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Edit Recipe
      </Link>}
   
      <ReviewList recipeId={recipe.id} />
      <div className="mt-8">
        <AddReview recipeId={recipe.id} />
      </div>
    </div>
  );
};

export default RecipeDetail;
