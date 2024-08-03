import Link from "next/link";
import {getCategories} from "../_services/recipeService";
import { useEffect, useState } from "react";

const RecipeList = ({ recipes }) => {

  const[categories, setCategories] = useState([]);

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

  if (!recipes.length) return <div>No recipes found.</div>;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => {
          const category = categories.find(t => t.id === recipe.category);
          const categoryColorClass = category ? categoryColors[category.name] : "bg-gray-200 text-gray-800";
          return (
            <div key={recipe.id} className="bg-white shadow-md rounded-lg p-4">
              <Link href={`/recipes/id/${recipe.id}`} className="text-black text-xl font-bold">
                {recipe.picture && <img src={recipe.picture} alt={recipe.title} className="mb-4 w-full max-w-xs" />}
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">{recipe.title}</h3>
                  {category && (
                    <span className={`inline-block ${categoryColorClass} text-xs px-2 py-1 rounded-full`}>
                      {category.name}
                    </span>
                  )}
                  <p className="text-base text-gray-600">{recipe.instructions.substring(0, 100)}...</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeList;
