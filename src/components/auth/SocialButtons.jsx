// Generic, stylized marks (not the literal brand logos) — enough for a
// "continue with" row without reproducing trademarked artwork exactly.
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.6 9.2c0-.6-.05-1.2-.15-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.4 0 4.5-.8 5.9-2.2l-2.9-2.2c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H1v2.3A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M4 10.8a5.4 5.4 0 0 1 0-3.6V4.9H1a9 9 0 0 0 0 8.2l3-2.3z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.6c1.3 0 2.5.45 3.4 1.35l2.6-2.6A9 9 0 0 0 1 4.9l3 2.3C4.7 5.1 6.7 3.6 9 3.6z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path
        d="M13.1 9.5c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 1-.1 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.5-2 .6-.9.9-1.7 1-1.8-.1 0-2-.8-2-3.5z"
        fill="#000"
      />
      <path
        d="M10.9 3.2c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.3 1.2-.5.6-1 1.5-.8 2.3.8.1 1.7-.4 2.3-1.2z"
        fill="#000"
      />
    </svg>
  );
}

export default function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-black/15 font-satoshi text-sm text-black hover:bg-surface-100"
      >
        <GoogleMark />
        Google
      </button>
      <button
        type="button"
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-black/15 font-satoshi text-sm text-black hover:bg-surface-100"
      >
        <AppleMark />
        Apple
      </button>
    </div>
  );
}
