import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import { deleteReview } from "../_services/reviewService";
import styles from './ReviewList.module.css';

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

  const handleDelete = async (reviewId, userId, recipeId, photos) => {
    try {
      await deleteReview(reviewId, userId, recipeId, photos);
      setReviews(reviews.filter(review => review.id !== reviewId));
      onDeleteReview(reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{review.rating} stars</p>
                <p className="mt-2">{review.comment}</p>
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {review.photos.map((photo, index) => (
                      <img key={index} src={photo} alt="Review photo" className="w-24 h-24 object-cover rounded-md border border-gray-300" />
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleDelete(review.id, review.authorID, review.recipeID, review.photos)}
                className=" text-black hover:text-red-400 ml-4"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ReviewList;
