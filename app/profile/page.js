"use client";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserRecipes from "../components/UserRecipes";
import UserReviews from "../components/UserReviews";
import { useUserAuth } from "../_utils/auth-context";

const ProfilePage = () => {
    const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
            <UserRecipes />
            <UserReviews />
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
