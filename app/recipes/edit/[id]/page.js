"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../../_utils/firebase";
import Head from "next/head";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RecipeForm from "../../../components/RecipeForm";

const EditRecipePage = ({params}) => {
  const id = params.id;
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        const recipeRef = doc(db, "recipes", id);
        const recipeSnap = await getDoc(recipeRef);
        if (recipeSnap.exists()) {
          setInitialData({"id": id, ...recipeSnap.data()});
        }
      };

      fetchRecipe();
    }
  }, [id]);

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <title>Edit Recipe</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
        <RecipeForm initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
};

export default EditRecipePage;
