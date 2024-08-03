"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "./_utils/firebase";
import Head from "next/head";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeList from "./components/RecipeList";
import SearchBar from "./components/SearchBar";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    };

    fetchRecipes();
  }, []);

  const handleSearch = (query) => {
    const results = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return (
    <div>
      <Head>
        <title>SAIT Recipes Platform</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <SearchBar onSearch={handleSearch} clearSearch={clearSearch}/>
        <RecipeList recipes={searchResults.length > 0 ? searchResults : recipes} />
      </main>
      <Footer />
    </div>
  );
}
