export function ConcebírLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size * 3.2} height={size} viewBox="0 0 128 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Leaf / embryo mark */}
      <path d="M18 8 C10 8, 4 14, 4 22 C4 30, 10 36, 18 36 C18 36, 18 28, 26 22 C18 22, 18 8, 18 8Z" fill="#3A7D44" opacity="0.9"/>
      <path d="M18 8 C26 8, 32 14, 32 22 C32 30, 26 36, 18 36 C18 36, 18 28, 10 22 C18 22, 18 8, 18 8Z" fill="#3A7D44" opacity="0.55"/>
      {/* Text */}
      <text x="38" y="27" fontFamily="'Playfair Display', Georgia, serif" fontSize="18" fontWeight="500" fill="#1C2B3A" letterSpacing="0.3">
        concebir
      </text>
    </svg>
  )
}
