export default function Logo({ className = '' }) {
  return (
    <svg
      className={`w-8 h-8 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C7.58 2 4 4.58 4 8c0 3.42 2.58 6.58 6 6.98V20c0 1.1.9 2 2 2s2-.9 2-2v-5.02c3.42-.4 6-3.56 6-6.98 0-3.42-2.58-6-6-6z"
        fill="currentColor"
      />
      <path
        d="M12 10a2 2 0 100-4 2 2 0 000 4z"
        fill="currentColor"
      />
    </svg>
  );
}
