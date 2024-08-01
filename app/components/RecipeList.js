import Link from "next/link";

const RecipeList = ({ recipes }) => {
  if (!recipes.length) return <div>No recipes found.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white shadow-md rounded-lg p-4">
          <Link href={`/recipes/id/${recipe.id}`} className="text-black text-xl font-bold">
            {recipe.picture && <img src={recipe.picture} alt={recipe.title} className="mb-4 w-full max-w-xs" />}
            <div>
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              <p className="text-gray-600">{recipe.instructions.substring(0, 100)}...</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
