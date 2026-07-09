export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#3f5b46" />
      <path d="M8 22V10h16l-2 4 2 2-2 2 2 4H8" stroke="#fbf8f3" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="22" r="2.6" fill="#d8b89e" />
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 font-display tracking-tight text-ink ${className}`}>
      Amal <em className="not-italic font-display italic text-forest-700">Yatri</em>
    </span>
  );
}
