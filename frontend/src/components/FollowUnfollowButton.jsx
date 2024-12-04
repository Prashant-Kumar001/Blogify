import React, { useEffect, useState } from "react";

const FollowUnfollowButton = ({ handler, initialState }) => {
  const [isFollowing, setIsFollowing] = useState(initialState);

  useEffect(() => {
    // Sync local state with the parent-provided initial state
    setIsFollowing(initialState);
  }, [initialState]);

  const handleClick = async () => {
    try {
      const success = await handler(); // Expect a boolean response indicating success
      if (success) {
        setIsFollowing((prev) => !prev);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 ${
        isFollowing ? "btn btn-danger" : "btn btn-success"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowUnfollowButton;
