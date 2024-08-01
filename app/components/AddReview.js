"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { addReview } from "../_services/reviewService";
import styles from './AddReview.module.css';

const AddReview = ({ recipeId }) => {
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
        onNewReview(newReview);
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handlePhotosChange = (e) => {
    setPhotos([...e.target.files]); };

    return (
      user &&
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block font-medium text-gray-700">Rating</label>
          <div className="flex space-x-2 mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                className={`px-4 py-2 border rounded-md ${rating === value ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-100 border-gray-300'} focus:outline-none`}
                onClick={() => handleRatingClick(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block font-medium text-gray-700">Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="photos" className="block font-medium text-gray-700">Photos</label>
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
    );
  };
  
  export default AddReview;