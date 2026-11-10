// Шаңырақ — киіз үйдің төбесі: сайттың логотипі
import { useId } from "react";

export default function Shanyrak({ size = 38, className = "" }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg className={`shanyrak ${className}`} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Shanyrak">
      <defs>
        <linearGradient id={`sg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd84f" />
          <stop offset="1" stopColor="#e88a00" />
        </linearGradient>
        <radialGradient id={`ss${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#58d6ff" />
          <stop offset="1" stopColor="#1b4fd6" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#ss${id})`} />
      <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#sg${id})`} strokeWidth="5" />
      <g stroke="#fff6d0" strokeWidth="1.6" strokeLinecap="round" opacity=".85">
        {spokes.map((a) => (
          <path key={a} d="M50 12 Q53 24 50 36" transform={`rotate(${a} 50 50)`} fill="none" />
        ))}
      </g>
      <circle cx="50" cy="50" r="30" fill="none" stroke={`url(#sg${id})`} strokeWidth="3.4" />
      {/* Кереге айқастары */}
      <g stroke={`url(#sg${id})`} strokeWidth="4.6" strokeLinecap="round">
        <path d="M50 20 V80 M20 50 H80" />
      </g>
      <g stroke="#fff6d0" strokeWidth="1.4" opacity=".8" strokeLinecap="round">
        <path d="M50 20 V80 M20 50 H80" />
      </g>
      <circle cx="50" cy="50" r="8" fill={`url(#sg${id})`} stroke="#fff6d0" strokeWidth="1.6" />
    </svg>
  );
}
