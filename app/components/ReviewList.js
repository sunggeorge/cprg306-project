import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";

const ReviewList = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("recipeID", "==", recipeId));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    };

    fetchReviews();
  }, [recipeId]);

  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="mb-4">
            <p className="font-bold">{review.rating} stars</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
