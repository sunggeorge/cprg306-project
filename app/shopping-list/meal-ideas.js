'use client'
import { useState, useEffect } from "react";



export default function MealIdeas({ingredient}) {

    const [meals, setMeals] = useState([]);
    const [mealIngredient, setMealIngredient] = useState([]);

    async function fetchMealIdeas() {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
      }

    async function loadMealIdeas() {
        const mealData = await fetchMealIdeas();
        mealData? setMeals(mealData.meals) : setMeals([]);
    }

    useEffect(() => {
        loadMealIdeas();
    }, [ingredient]);


    async function fetchIngredient(mealID) {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
          const data = await response.json();
        //   console.log(`mealID: ${mealID}`);
        //   console.log(data);
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
      }

    async function loadIngredient(idMeal) {
        // console.log(`Input idMeal: ${idMeal}`);
        const mealIngredient = await fetchIngredient(idMeal);
        mealIngredient? setMealIngredient(mealIngredient.meals[0]) : setMealIngredient([]);
    }

    function getIngredients(mealIngredient) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            let ingredient = mealIngredient[`strIngredient${i}`];
            let measure = mealIngredient[`strMeasure${i}`];
    
            if (!ingredient || !measure) {
                break;
            }
    
            ingredients.push(`${ingredient} ${measure}`);
            
        }
        return ingredients.join('\n');
    }

    return (
        <div className="p-2 m-4 text-yellow-400 max-w-sm">
            <h2 className="text-xl font-bold">Meal Ideas</h2>
            
            {meals != null ? (
   
            <ul>
                {meals.map((meal) => {
                    return <li key={meal.idMeal} onClick={() => loadIngredient(meal.idMeal)} 
                            className="text-sm p-2 m-2 bg-slate-900 text-yellow-400 max-w-sm hover:bg-teal-400 cursor-pointer">
                                {meal.strMeal}
                                
                                {mealIngredient != null && mealIngredient.idMeal == meal.idMeal && 
                                (
                                    <>
                                        <p className='ml-3 text-xs'>Ingredients needed:</p>
                                        {getIngredients(mealIngredient).split('\n').map((ingredient, index) => (
                                            <p key={index} className='ml-10 text-xs'>{ingredient}</p>
                                        ))}
                                    </>
                                )}
                            </li>
                })}
            </ul>
        
        ) : (  
            <p className='text-sm'>No meal ideas found for {ingredient}</p>   
            )}
            
           
        </div>
    )


}
