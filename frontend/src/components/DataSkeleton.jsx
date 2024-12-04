import React from 'react';

const DataSkeleton = () => {
  return (
    <div className="flex w-full max-w-md items-center gap-4 p-4 border  rounded-lg  shadow-sm">
      {/* Profile Image Skeleton */}
      <div className="skeleton1 w-12 h-12 rounded-full shrink-0"></div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 gap-2">
        {/* Title Skeleton */}
        <div className="skeleton1 h-4 w-3/4"></div>

        {/* Description Skeleton */}
        <div className="skeleton1 h-3 w-full"></div>
        <div className="skeleton1 h-3 w-5/6"></div>

        {/* Category and Likes Skeleton */}
        <div className="flex items-center gap-4 mt-3">
          <div className="skeleton1 h-4 w-16 rounded"></div>
          <div className="skeleton1 h-4 w-10 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default DataSkeleton;
