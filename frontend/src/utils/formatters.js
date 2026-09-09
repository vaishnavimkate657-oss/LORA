export const formatCurrency = (amount) => {
  if (amount == null) return '$0';
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatRating = (rating) => {
  if (rating == null) return '5.0';
  return Number(rating).toFixed(1);
};

export const formatReviewsCount = (count) => {
  if (count == null) return '0';
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
};
