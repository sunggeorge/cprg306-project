import Link from "next/link";
import styles from './RecipeList.module.css';

const RecipeList = ({ recipes }) => {
  if (!recipes.length) return <div>No recipes found.</div>;
  console.log(recipes);
  return (
    <div className={styles.recipeList}>
      {recipes.map((recipe) => (
        <div key={recipe.id} className={styles.recipeItem}>
          <Link href={`/recipes/id/${recipe.id}`} className="text-black text-xl font-bold">
            {recipe.picture && <img src={recipe.picture} alt={recipe.title} className="mb-4 w-full max-w-xs" />}
            <div className={styles.content}>
              <h3>{recipe.title}</h3>
              <p>{recipe.instructions.substring(0, 100)}...</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
