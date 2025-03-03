// Create a central animation configuration
export const transitions = {
  default: "transition-all duration-200 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  theme: "transition-colors duration-200",
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  // Add more standard animations
}; 