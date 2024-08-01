"use client";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";

const Header = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <header className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          SAIT Recipes Platform
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-white text-2xl">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="text-white text-2xl">
                Profile
              </Link>
              <Link href="/recipes/add" className="text-white text-2xl">
                Add Recipe
              </Link>
              <button onClick={firebaseSignOut} className="text-white text-2xl">
                Logout
              </button>
            </>
          ) : (
            <button onClick={gitHubSignIn} className="text-white text-2xl">
              Login with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
