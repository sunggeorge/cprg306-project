// "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import { addRecipe } from "../_services/recipeService";

const RecipeForm = ({ initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [ingredients, setIngredients] = useState(initialData.ingredients || []);
  const [instructions, setInstructions] = useState(initialData.instructions || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [picture, setPicture] = useState(initialData.picture || "");  
  const { user } = useUserAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const recipeData = { title, ingredients, instructions, category, picture };
      if (isEdit) {
        await updateRecipe(initialData.id, recipeData);
      } else {
        await addRecipe(user.uid, recipeData);
      }
      router.push("/");
    }
  };

  let isEdit = (initialData == {})? false : true;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
          Picture Link
        </label>
        <input
          type="text"
          id="picture"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>      
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isEdit ? "Update Recipe" : "Submit Recipe"}
      </button>
    </form>
  );
};

export default RecipeForm;
