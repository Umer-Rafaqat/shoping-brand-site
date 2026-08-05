import { Star, BadgeCheck, MoreHorizontal } from "lucide-react";

export default function ReviewCard({ review }) {
  const { name, verified, rating, date, quote } = review;

  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(rating)
                  ? "fill-brand-yellow text-brand-yellow"
                  : "fill-black/10 text-black/10"
              }
            />
          ))}
        </div>
        <button
          aria-label="More options"
          className="text-black/40 hover:text-black"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="font-satoshi text-base font-bold">{name}</span>
        {verified && (
          <BadgeCheck size={16} className="fill-green-500 text-white" />
        )}
      </div>

      <p className="mt-3 font-satoshi text-sm leading-relaxed text-black/60">
        "{quote}"
      </p>

      <p className="mt-4 font-satoshi text-xs text-black/40">{date}</p>
    </div>
  );
}
