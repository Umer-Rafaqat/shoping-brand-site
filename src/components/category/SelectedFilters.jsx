import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Shows active color/size/dress-style filters as removable chips —
// this is the "Badge" usage from the spec (selected sizes & more).
export default function SelectedFilters({ filters, onChange }) {
  const { selectedColors, selectedSizes, selectedDressStyles } = filters;

  const chips = [
    ...selectedColors.map((v) => ({ group: "selectedColors", value: v })),
    ...selectedSizes.map((v) => ({ group: "selectedSizes", value: v })),
    ...selectedDressStyles.map((v) => ({ group: "selectedDressStyles", value: v })),
  ];

  if (chips.length === 0) return null;

  const remove = (group, value) => {
    onChange({
      ...filters,
      [group]: filters[group].filter((v) => v !== value),
    });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map(({ group, value }) => (
        <Badge
          key={`${group}-${value}`}
          variant="dark"
          className="flex items-center gap-1.5 py-1.5"
        >
          {value}
          <button
            type="button"
            aria-label={`Remove ${value} filter`}
            onClick={() => remove(group, value)}
          >
            <X size={12} />
          </button>
        </Badge>
      ))}
    </div>
  );
}