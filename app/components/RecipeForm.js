"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import { addRecipe, updateRecipe, getCategories } from "../_services/recipeService";
import '@fortawesome/fontawesome-free/css/all.min.css';

const RecipeForm = ({ initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [ingredients, setIngredients] = useState(initialData.ingredients || [""]);
  const [instructions, setInstructions] = useState(initialData.instructions || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [picture, setPicture] = useState(initialData.picture || "");     
  const { user } = useUserAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [pictureURL, setPictureURL] = useState([]);


  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }
    fetchCategories();
  }, []);

  const handlePhotosChange = (e) => {
    setPictureURL([...e.target.files]);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const recipeData = { title, ingredients, instructions, category, picture, pictureURL };
      // console.log('recipeData:', pictureURL, recipeData);
      if (isEdit) {
        await updateRecipe(initialData.id, recipeData);
      } else {
        await addRecipe(user.uid, recipeData);
      }
      router.push("/");
    }
  };

  let isEdit = Object.keys(initialData).length !== 0;
  console.log('initialData:', initialData, initialData == {}, isEdit);
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
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
      {picture && isEdit && (
        <img src={picture} alt={title} className="mb-4 mx-auto" style={{ height: "600px", width: "auto"}}/>
      )} 
      <div>
          <label htmlFor="photos" className="block text-2xl font-bold mb-2 text-gray-700">
            Photos <span className="text-red-500 text-base">*</span>
          </label>
          <input
            id="photos"
            type="file"
            multiple
            required
            onChange={handlePhotosChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>         
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
          Ingredients <span className="text-red-500">*</span>
        </label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mt-1">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
            <i
              className="fas fa-trash-alt ml-2 text-red-500 cursor-pointer"
              onClick={() => removeIngredient(index)}
            ></i>
          </div>
        ))}
        <i
          className="fas fa-plus mt-2 text-blue-500 cursor-pointer"
          onClick={addIngredient}
        ></i>
      </div>
      <div>
      <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
        Instructions <span className="text-red-500">*</span>
      </label>
        <textarea
          id="instructions"
          value={instructions}
          style={{ height: "200px" }}
          onChange={(e) => setInstructions(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
      </div>
      <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Category <span className="text-red-500">*</span>
      </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
          disabled={isEdit}
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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
