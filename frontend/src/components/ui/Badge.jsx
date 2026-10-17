export default function Badge({
  children,
  variant = "neutral",
  className = "",
}) {
  const variants = {
    success: "badge-success",
    error: "badge-error",
    neutral: "badge-neutral",
    instadog: "badge-instadog",
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
