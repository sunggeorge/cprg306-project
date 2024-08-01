"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import styles from './UserReviews.module.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useUserAuth();

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
  
    return date.toLocaleString('en-US', options);
  }

  useEffect(() => {
    if (user) {
      const fetchUserReviews = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // console.log('User data: ', userData);
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
          console.log('User reviews: ', reviewsData);
          setReviews(reviewsData.filter(review => review !== null)); // Filter out any null values
        }
      };

      fetchUserReviews();
    }
  }, [user]);

  if (!reviews.length) return <div>No reviews found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      <ul className="space-y-4">
        {reviews.map(review => (
          <li key={review.id} className="border p-4 rounded-lg shadow-sm">
            <Link href={`/recipes/id/${review.recipeID}`} >
              <a className="text-blue-600 hover:underline">
                <b>{review.rating} stars:</b> {review.comment}<br />
                {formatTimestamp(review.createdAt)}
              </a>
            </Link>
            {review.photos && review.photos.length > 0 && (
              <div className="mt-4 flex space-x-2">
                {review.photos.map((photo, index) => (
                  <img key={index} src={photo} alt="Review photo" className="w-24 h-24 object-cover rounded-md border border-gray-300" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserReviews;
