interface StreakIndicatorProps {
  days: number;
}

export function StreakIndicator({ days }: StreakIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Streak flame with number */}
      <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center relative">
        {/* Flame behind number */}
        <svg
          className="absolute w-10 h-10 top-1 left-1/2 -translate-x-1/2"
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* Outer flame */}
          <path
            d="M12 2C12 2 8 6 8 11C8 14 9.5 16 12 16C14.5 16 16 14 16 11C16 6 12 2 12 2Z"
            fill="#e07b39"
          />
          {/* Inner bright flame */}
          <path
            d="M12 7C12 7 10 9 10 12C10 13.5 11 14.5 12 14.5C13 14.5 14 13.5 14 12C14 9 12 7 12 7Z"
            fill="#f4a261"
          />
          {/* Bright tip */}
          <path
            d="M12 10C12 10 11 11 11 12.5C11 13.3 11.5 14 12 14C12.5 14 13 13.3 13 12.5C13 11 12 10 12 10Z"
            fill="#f9c87c"
          />
        </svg>
        <span className="text-2xl font-bold text-white relative z-10 mt-3">
          {days}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">{days} day streak</p>
        <p className="text-muted">Keep shipping!</p>
      </div>
    </div>
  );
}
