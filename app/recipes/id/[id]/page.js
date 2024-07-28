"use client";
// import { useRouter } from "next/navigation";
import Head from "next/head";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RecipeDetail from "../../../components/RecipeDetail";

const RecipeDetailPageByID = ({params}) => {
  // const router = useRouter();
  const id = params.id;
  console.log(id);

  return (
    <div>
      <Head>
        <title>Recipe Detail</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <RecipeDetail recipeId={id} />
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetailPageByID;
