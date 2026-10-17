import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = "🐾",
  title,
  description,
  actionText,
  actionHref,
  className = "",
}) {
  return (
    <div
      className={`text-center py-20 bg-white rounded-xl border border-neutral-200 ${className}`}
    >
      <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto">
          {description}
        </p>
      )}
      {actionText && actionHref && (
        <Link to={actionHref} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}
