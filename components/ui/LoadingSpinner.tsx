// Create a standard loading component
type SizeType = "sm" | "md" | "lg";

export function LoadingSpinner({ size = "md" }: { size?: SizeType }) {
  const sizeClasses: Record<SizeType, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-brand ${sizeClasses[size]}`}></div>
  );
} 