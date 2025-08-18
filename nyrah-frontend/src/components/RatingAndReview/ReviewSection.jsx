import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { IoIosStar } from "react-icons/io";
import ReviewSlider from "./ReviewSlider";
import { useSelector } from "react-redux";

const ReviewSection = ({ productId }) => {
  const { user } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/rating/${productId}`);
      setReviews(res.data.ratings);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const submitReview = useCallback(async () => {
  try {
    await axios.post(`/rating/${productId}`, {
      rating: selectedRating,
      review: reviewText,
    });
    setShowModal(false);
    fetchReviews(); // refresh reviews after submitting
  } catch (err) {
    console.error("Error submitting review", err);
  }
}, [productId, selectedRating, reviewText]);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const userReview = reviews.find((r) => r?.user?._id === user?._id);
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.review || "");
    }
  }, [reviews, user]);

  

  return (
    <div className="mb-5 px-4 text-center font-cardo">
      <h2 className="text-3xl font-semibold mb-4">Customer Reviews</h2>

      <button
        onClick={() => setShowModal(true)}
        className="btn btn-outline rounded-none btn-neutral"
      >
        Write a Review
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000078] bg-opacity-30">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl relative">
            <button
              className="absolute top-3 right-4 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold capitalize mb-4">
              Rate this product
            </h3>

            {/* Star selector */}
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <IoIosStar
                    key={i}
                    size={28}
                    className="cursor-pointer transition-colors"
                    color={
                      value <= (hoveredRating || selectedRating)
                        ? "#facc15"
                        : "#e5e7eb"
                    }
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setSelectedRating(value)}
                  />
                );
              })}
            </div>

            <textarea
              className="textarea rounded-none textarea-bordered w-full mb-4"
              rows="4"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button
              className="btn btn-outline btn-neutral rounded-none w-full"
              onClick={submitReview}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      <ReviewSlider reviews={reviews}/>
    </div>
  );
};

export default ReviewSection;
