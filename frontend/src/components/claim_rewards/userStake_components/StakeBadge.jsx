const StatusBadge = ({ resolved, isWinner, isExpired }) => {
  const now = new Date();
  const deadlineDate = new Date();
  const refundDeadline = new Date(
    deadlineDate.getTime() + 5 * 24 * 60 * 60 * 1000
  );
  const isRefundable = isExpired && now >= refundDeadline;

  if (resolved) {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isWinner
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
        } border`}
      >
        {isWinner ? "Won" : "Lost"}
      </span>
    );
  }

  if (isRefundable) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
        Refundable
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        Pending
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
      Active
    </span>
  );
};

export default StatusBadge;
