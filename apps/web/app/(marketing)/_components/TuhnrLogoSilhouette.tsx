interface TuhnrLogoSilhouetteProps {
  size?: number;
  className?: string;
  color?: string;
}

export function TuhnrLogoSilhouette({
  size = 64,
  className = "",
  color = "#e07b39",
}: TuhnrLogoSilhouetteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* Single flame silhouette - pointed but matching height */}
      <path
        d="M32 4C32 4 24 13 24 25C24 31 27 36 32 36C37 36 40 31 40 25C40 13 32 4 32 4Z"
        fill={color}
      />

      {/* T as single shape */}
      <path
        d="M16 38 L48 38 L48 45 L38 45 L37 60 C37 62 35 63 32 63 C29 63 27 62 27 60 L26 45 L16 45 Z"
        fill={color}
      />
    </svg>
  );
}
