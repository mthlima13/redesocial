export default function Avatar({
  src,
  alt,
  size = "md",
  className = "",
  fallback = "🐾",
}) {
  const sizes = {
    sm: "avatar-sm",
    md: "avatar",
    lg: "avatar-lg",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-lg">
          {fallback}
        </div>
      )}
    </div>
  );
}
