export default function ThumbnailColumn({ images, activeIndex, onSelect }) {
  return (
    <div className=" flex gap-3 lg:w-[150px] lg:flex-col lg:overflow-visible">
      {images.map((src, i) => (
        <button
          key={src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`View image ${i + 1}`}
          className={`aspect-square flex-1 overflow-hidden rounded-2xl border bg-surface-100 lg:w-full lg:flex-none ${
            activeIndex === i ? "border-black" : "border-transparent"
          }`}
        >
          <img src={src} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
