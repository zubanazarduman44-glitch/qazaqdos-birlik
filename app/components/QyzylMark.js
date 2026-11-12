// Qyzyl til белгісі: Q әрпі, құйрығы — қызыл тіл («Өнер алды — қызыл тіл»)
export default function QyzylMark({ size = 40, ink = "#1F2430", red = "#B8322A", groove = "#FFFDF7", title }) {
  return (
    <svg className="qz-mark" viewBox="0 0 200 200" width={size} height={size} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <circle cx="94" cy="92" r="58" fill="none" stroke={ink} strokeWidth="28" />
      <path className="qz-tongue" d="M118 126 C144 124 176 146 183 177 C185 188 176 194 165 189 C140 178 122 160 111 139 Z" fill={red} />
      <path d="M127 139 C145 150 160 163 170 180" fill="none" stroke={groove} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
