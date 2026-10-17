export default function LoadingSpinner({
  size = "md",
  className = "",
  text,
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-instadog-600`}
      />
      {text && <span className="text-sm text-neutral-600">{text}</span>}
    </div>
  );
}
