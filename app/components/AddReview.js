"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { addReview } from "../_services/reviewService";

const AddReview = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await addReview(user.uid, recipeId, { rating, comment });
      setRating(0);
      setComment("");//
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          min="1"
          max="5"
          required
        />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
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
