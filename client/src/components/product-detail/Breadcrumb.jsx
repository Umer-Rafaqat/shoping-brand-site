import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mt-6 mb-9">
      <ol className="flex flex-wrap items-center gap-2 font-satoshi text-sm text-black/60">
        {items.map((label, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={label} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-black">{label}</span>
              ) : (
                <Link to="/" className="hover:text-black">
                  {label}
                </Link>
              )}
              {!isLast && <ChevronRight size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
