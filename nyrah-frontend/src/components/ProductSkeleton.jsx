const ProductSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-none shadow">
      <div className=" aspect-square bg-gray-300 mb-4 rounded-none" />
      <div className="h-5 bg-gray-300 mb-2 rounded w-3/4 mx-auto" />
      <div className="flex gap-1 justify-center items-center pb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/6" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
