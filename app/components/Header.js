"use client";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";

const Header = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          SAIT Recipes Platform
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-white">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="text-white">
                Profile
              </Link>
              <Link href="/recipes/add" className="text-white">
                Add Recipe
              </Link>              
              <button onClick={firebaseSignOut} className="text-white">
                Logout
              </button>
            </>
          ) : (
            <button onClick={gitHubSignIn} className="text-white">
              Login with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;