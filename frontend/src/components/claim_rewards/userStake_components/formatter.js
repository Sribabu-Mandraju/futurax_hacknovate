export const formatCurrency = (value) => {
  if (!value) return "0.00";
  const numValue = Number.parseFloat(value);
  return numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (secondsUntilDeadline) => {
  if (!secondsUntilDeadline) return "";
  const deadlineTimestamp = Date.now() + secondsUntilDeadline * 1000;
  const date = new Date(deadlineTimestamp);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", "");
};