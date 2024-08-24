export const generateOrderCode = (userId: number): string => {
  const timestamp = Date.now().toString();
  const uniquePart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${userId}-${timestamp}-${uniquePart}`;
};
