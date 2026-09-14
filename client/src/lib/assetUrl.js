export const assetUrl = (value) => {
  if (!value) return "";

  if (value.startsWith("http") || value.startsWith("/")) return value;
  return `/assets/${value}`;
};
