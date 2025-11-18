import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary bg-white",
    ghost: "text-primary hover:bg-blue-50",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-6 py-3 text-base font-medium",
    lg: "px-8 py-4 text-lg font-semibold"
  };

  return (
    <button
      className={cn(
        "rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;