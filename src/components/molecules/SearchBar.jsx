import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search products...", className }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;