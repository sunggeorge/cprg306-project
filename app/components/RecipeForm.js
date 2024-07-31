import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import { addRecipe, updateRecipe } from "../_services/recipeService";
import styles from './RecipeForm.module.css';

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
    <form onSubmit={handleSubmit} className={styles.recipeForm}>
      <div>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div>
        <label htmlFor="picture" className={styles.label}>
          Picture Link
        </label>
        <input
          type="text"
          id="picture"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          className={styles.input}
        />
      </div>      
      <div>
        <label htmlFor="ingredients" className={styles.label}>
          Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className={styles.textarea}
          required
        />
      </div>
      <div>
        <label htmlFor="instructions" className={styles.label}>
          Instructions
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className={styles.textarea}
          required
        />
      </div>
      <div>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button
        type="submit"
        className={styles.button}
      >
        {isEdit ? "Update Recipe" : "Submit Recipe"}
      </button>
    </form>
  );
};

export default RecipeForm;
