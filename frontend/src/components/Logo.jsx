import { useId } from 'react';

/**
 * Logo do InstaDog: uma coleira com plaquinha de identificação
 * onde está gravada a patinha do cão.
 */
export default function Logo({ className = 'w-8 h-8' }) {
  // useId gera ids com ":" que não funcionam bem em url(#id) — daí a limpeza
  const maskId = `instadog-paw-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Máscara que recorta a patinha da plaquinha */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="black" />
        <circle cx="12" cy="19.4" r="4.1" fill="white" />
        <ellipse cx="12" cy="20.4" rx="1.8" ry="1.4" fill="black" />
        <circle cx="10.1" cy="18.4" r="0.85" fill="black" />
        <circle cx="11.6" cy="17.6" r="0.85" fill="black" />
        <circle cx="13" cy="17.6" r="0.85" fill="black" />
        <circle cx="14.3" cy="18.4" r="0.85" fill="black" />
      </mask>

      {/* Coleira */}
      <path
        d="M2.7 12.6c3.7-3.2 7.8-4.8 9.3-4.8s5.6 1.6 9.3 4.8l-2.2 3.7c-2.5-2.1-5-3.2-7.1-3.2s-4.6 1.1-7.1 3.2L2.7 12.6Z"
        fill="currentColor"
      />

      {/* Argola da plaquinha */}
      <circle cx="12" cy="14.3" r="1.2" fill="currentColor" />

      {/* Plaquinha com a patinha recortada */}
      <circle cx="12" cy="19.4" r="4.1" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
