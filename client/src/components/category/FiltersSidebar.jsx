import { useEffect, useState } from "react";
import { ChevronRight, SlidersVertical, Check, X } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { colorSwatches, sizes } from "@/data/filters";

export default function FiltersSidebar({
  filters,
  onChange,
  onApply,
  isOpen,
  onClose,
  categories = [],
  activeCategorySlug,
  onCategoryChange,
  className,
}) {
  const { priceRange, selectedColors, selectedSizes } = filters;
  const [localPrice, setLocalPrice] = useState(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange);
  }, [priceRange]);

  const toggleInArray = (arr, value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white p-5 transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:z-auto lg:w-[295px] lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:rounded-2xl lg:border lg:border-black/10",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-satoshi text-lg font-bold">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="lg:hidden"
        >
          <X size={20} />
        </button>
        <SlidersVertical size={18} className="hidden text-black/60 lg:block" />
      </div>

      <div className="border-t border-black/10 py-2">
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => onCategoryChange(category.slug)}
            className={`flex w-full items-center justify-between py-2.5 font-satoshi text-sm hover:text-black ${
              activeCategorySlug === category.slug
                ? "font-medium text-black"
                : "text-black/70"
            }`}
          >
            {category.name}
            <ChevronRight size={16} />
          </button>
        ))}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["price", "colors", "size"]}
        className="border-t border-black/10"
      >
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <Slider
              min={0}
              max={1000}
              step={5}
              value={localPrice}
              onValueChange={setLocalPrice}
              onValueCommit={(val) => onChange({ ...filters, priceRange: val })}
            />
            <div className="mt-3 flex items-center justify-between font-satoshi text-sm text-black/70">
              <span>${localPrice[0]}</span>
              <span>${localPrice[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3">
              {colorSwatches.map((color) => {
                const isChecked = selectedColors.includes(color.id);
                return (
                  <button
                    key={color.id}
                    type="button"
                    aria-label={color.id}
                    aria-pressed={isChecked}
                    onClick={() =>
                      onChange({
                        ...filters,
                        selectedColors: toggleInArray(selectedColors, color.id),
                      })
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                    style={{ backgroundColor: color.value }}
                  >
                    {isChecked && (
                      <Check
                        size={16}
                        className={
                          color.id === "white" ? "text-black" : "text-white"
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        selectedSizes: toggleInArray(selectedSizes, size),
                      })
                    }
                    className={`rounded-full px-4 py-2 font-satoshi text-sm transition-colors ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-surface-100 text-black/70 hover:bg-surface-100/70"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="mt-5 w-full" onClick={onApply}>
        Apply Filter
      </Button>
    </aside>
  );
}
