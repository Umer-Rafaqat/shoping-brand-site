export const assetUrl = (value) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `/assets/${value}`;
};
