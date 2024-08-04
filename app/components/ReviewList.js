'use clients';
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../_utils/firebase";
import { deleteReview } from "../_services/reviewService";
import { useUserAuth } from "../_utils/auth-context";

const ReviewList = ({ recipeId, onDeleteReview }) => {
  const [reviews, setReviews] = useState([]);
  const[categories, setCategories] = useState([]);
  const { user } = useUserAuth();
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("recipeID", "==", recipeId));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    };

    fetchReviews();
  }, [recipeId]);

  useEffect(() => {
    const sorted = [...reviews].sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds));
    setSortedReviews(sorted);
  }, [reviews]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = date.toLocaleString('en-US', options).replace(',', '');
    return `${year}-${month}-${day} ${time}`;
  };

  const handleDelete = async (reviewId, userId, recipeId, photos) => {
    try {
      await deleteReview(reviewId, userId, recipeId, photos);
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewId));
      // Notify parent component about the deleted review
      onDeleteReview(reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
;

  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <ul className="space-y-4">
        {sortedReviews.map((review) => (
          <li key={review.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{review.rating} stars</p>
                <p className="mt-2">{review.comment}</p>
                <p className="mt-2">{formatDate(review.createdAt)}</p>
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {review.photos.map((photo, index) => (
                      <img key={index} src={photo} alt="Review photo" className="w-24 h-24 object-cover rounded-md border border-gray-300" />
                    ))}
                  </div>
                )}
              </div>
              {user && user.uid == review.authorID &&
              <button 
                onClick={() => handleDelete(review.id, review.authorID, review.recipeID, review.photos)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Delete
              </button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
