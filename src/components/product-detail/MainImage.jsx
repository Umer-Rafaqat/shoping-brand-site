export default function MainImage({ src, alt }) {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-[20px] bg-surface-100 lg:aspect-auto lg:h-[530px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}