"use client";

// Import the useUserAuth hook
import { useUserAuth } from "./_utils/auth-context";
import { useEffect } from "react";
import { redirect } from 'next/navigation'



const Page = () => {
    const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

    useEffect(() => {
        if (user) {
            redirect('/week-10/shopping-list')
        }
    }, [user]);

    // if ({user}) {
    //     redirect('/week-8/shopping-list')
    // }                 

    return (
        <>
            <div>
                <h1>Week 8</h1>
                <p>
                    {user ? (
                        <button className="border p-2 border-yellow-500" onClick={firebaseSignOut}>Sign Out</button>
                    ) : (
                        <button className="border p-2 border-yellow-500" onClick={gitHubSignIn}>Sign In with GitHub</button>
                    )}
                </p>
            </div>
            <div className="p-5 m-5">
                <p>{user ? "Hi there!" : "Please sign in with above button!"}</p>
                {user && user.displayName && (
                    <p>Welcome, {user.displayName} ({user.email})</p>

                )}


            </div>
        </>
    );
};

export default Page;