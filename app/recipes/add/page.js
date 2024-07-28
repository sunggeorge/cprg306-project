"use client";
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RecipeForm from "../../components/RecipeForm";

const AddRecipePage = () => {
  return (
    <div>
      <Head>
        <title>Add Recipe</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Add a New Recipe</h1>
        <RecipeForm />
      </main>
      <Footer />
    </div>
  );
};

export default AddRecipePage;
