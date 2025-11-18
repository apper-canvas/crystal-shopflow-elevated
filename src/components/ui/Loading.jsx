import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "product-grid") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="shimmer h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4" />
              <div className="shimmer h-3 bg-gray-200 rounded w-1/2" />
              <div className="shimmer h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "product-detail") {
    return (
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto p-6">
        <div className="space-y-4">
          <div className="shimmer h-96 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="shimmer h-8 bg-gray-200 rounded w-3/4" />
          <div className="shimmer h-4 bg-gray-200 rounded w-1/4" />
          <div className="shimmer h-12 bg-gray-200 rounded w-1/3" />
          <div className="space-y-2">
            <div className="shimmer h-3 bg-gray-200 rounded" />
            <div className="shimmer h-3 bg-gray-200 rounded" />
            <div className="shimmer h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="shimmer h-12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;