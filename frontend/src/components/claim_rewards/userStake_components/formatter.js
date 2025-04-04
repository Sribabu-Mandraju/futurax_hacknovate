export const formatCurrency = (value) => {
  // Format as currency with 2 decimal places
  if (!value) return "0.00";

  const numValue = Number.parseFloat(value);
  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format date to readable format
export const formatDate = (secondsUntilDeadline) => {
  if (!secondsUntilDeadline) return "";

  // Get the absolute deadline timestamp
  const deadlineTimestamp = Date.now() + secondsUntilDeadline * 1000;
  const date = new Date(deadlineTimestamp);

  return date
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", ""); // Removes the comma between date and time
};
