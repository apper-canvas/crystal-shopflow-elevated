import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Try adjusting your search or filters", 
  icon = "Package",
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-gray-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name={action.icon || "ShoppingBag"} className="w-5 h-5" />
            <span>{action.label}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Empty;