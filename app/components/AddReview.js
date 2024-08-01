"use client";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { addReview } from "../_services/reviewService";
import styles from './AddReview.module.css';

const AddReview = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await addReview(user.uid, recipeId, { rating, comment });
      setRating(0);
      setComment("");
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    user &&
    <form onSubmit={handleSubmit} className={styles.addReview}>
      <div>
        <label htmlFor="rating" className={styles.label}>
          Rating
        </label>
        <div className={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              className={`${styles.ratingButton} ${rating === value ? styles.selected : ''}`}
              onClick={() => handleRatingClick(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className={styles.label}>
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.textarea}
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
