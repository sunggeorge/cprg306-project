"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useUserAuth();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = date.toLocaleString('en-US', options).replace(',', '');
    return `${year}-${month}-${day} ${time}`;
  };

  useEffect(() => {
    if (user) {
      const fetchUserReviews = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const reviewsData = await Promise.all(
            userData.reviewedRecipes.map(async (reviewId) => {
              if (reviewId) {
                const reviewRef = doc(db, "reviews", reviewId);
                const reviewSnap = await getDoc(reviewRef);
                return { id: reviewSnap.id, ...reviewSnap.data() };
              }
              return null;
            })
          );
          const validReviews = reviewsData.filter(review => review !== null)
          setReviews([...validReviews].sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds)));
        }
      };

      fetchUserReviews();
    }
  }, [user]);

  if (!reviews.length) return <div>No reviews found.</div>;


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-4">My Reviews</h1>
      <ul className="space-y-4">
        {reviews.map(review => (
          <li key={review.id} className="border p-4 rounded-lg shadow-sm">
            <Link href={`/recipes/id/${review.recipeID}`} className="text-blue-600 hover:underline">
                <b>{review.rating} stars:</b> {review.comment}<br />
                {formatDate(review.createdAt)}
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
