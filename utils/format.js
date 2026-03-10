export const formatPrice = (n) => {
  if (!n) return "0";
  return Number(n).toLocaleString("vi-VN");
};