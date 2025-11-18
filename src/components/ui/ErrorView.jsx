import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className,
  showRetry = true 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {error}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            <span>Try Again</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ErrorView;