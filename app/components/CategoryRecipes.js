import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import RecipeList from "./RecipeList";

const CategoryRecipes = ({ category }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const q = query(collection(db, "recipes"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const recipesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchRecipes();
  }, [category]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{category}</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default CategoryRecipes;
