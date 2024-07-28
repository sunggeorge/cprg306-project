"use client";
import { useEffect, useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    if (user) {
      const fetchUserReviews = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const reviewsData = await Promise.all(
            userData.reviewedRecipes.map(async (reviewId) => {
              if (reviewId) { // Ensure reviewId is valid
                const reviewRef = doc(db, "reviews", reviewId);
                const reviewSnap = await getDoc(reviewRef);
                return { id: reviewSnap.id, ...reviewSnap.data() };
              }
              return null;
            })
          );
          setReviews(reviewsData.filter(review => review !== null)); // Filter out any null values
        }
      };

      fetchUserReviews();
    }
  }, [user]);

  if (!reviews.length) return <div>No reviews found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>{review.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserReviews;