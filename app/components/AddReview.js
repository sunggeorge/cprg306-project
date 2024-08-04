"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { addReview } from "../_services/reviewService";

const AddReview = ({ recipeId, onNewReview }) => {  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useUserAuth();
  const [photos, setPhotos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const newReview = await addReview(user.uid, recipeId, { rating, comment, photos });
        // Clear the form fields after successful submission
        setRating(0);
        setComment("");
        setPhotos([]);
        onNewReview(newReview);  // Notify the parent component about the new review
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handlePhotosChange = (e) => {
    setPhotos([...e.target.files]);
  };

  return (
    user && (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-2xl font-bold mb-2 text-gray-700">
            Rating
          </label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                className={`border p-2 rounded ${
                  rating === value ? "bg-indigo-600 text-white" : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingClick(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-2xl font-bold mb-2 text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="photos" className="block text-2xl font-bold mb-2 text-gray-700">
            Photos
          </label>
          <input
            id="photos"
            type="file"
            multiple
            onChange={handlePhotosChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Review
        </button>
      </form>
    )
  );
};

export default AddReview;
