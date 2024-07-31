"use client";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";
import styles from './Header.module.css';

const Header = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          SAIT Recipes Platform
        </Link>
        <nav>
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/profile">Profile</Link>
              <Link href="/recipes/add">Add Recipe</Link>
              <button onClick={firebaseSignOut}>Logout</button>
            </>
          ) : (
            <button onClick={gitHubSignIn}>Login with GitHub</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
