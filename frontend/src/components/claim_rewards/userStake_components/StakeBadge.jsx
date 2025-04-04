const StatusBadge = ({ resolved, isWinner, isExpired }) => {
  if (resolved) {
    return isWinner ? (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
        bg-gradient-to-r from-purple-500/15 via-cyan-400/10 to-blue-500/15 text-transparent bg-clip-text
        border border-purple-500/30 backdrop-blur-sm"
      >
        <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
          Won
        </span>
      </div>
    ) : (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
        bg-red-500/15 text-red-500 border border-red-500/30 backdrop-blur-sm"
      >
        Lost
      </div>
    );
  }

  // Check if refund period has started (5+ days after deadline)
  const now = new Date();
  const deadlineDate = new Date();
  const refundDeadline = new Date(
    deadlineDate.getTime() + 5 * 24 * 60 * 60 * 1000
  ); // deadline + 5 days
  const isRefundable = isExpired && now >= refundDeadline;

  if (isRefundable) {
    return (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
        bg-amber-500/15 text-amber-500 border border-amber-500/30 backdrop-blur-sm"
      >
        Refundable
      </div>
    );
  }

  if (isExpired) {
    return (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
        bg-yellow-500/15 text-yellow-500 border border-yellow-500/30 backdrop-blur-sm"
      >
        Pending
      </div>
    );
  }

  return (
    <div
      className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
      bg-green-500/15 text-green-500 border border-green-500/30 backdrop-blur-sm"
    >
      Active
    </div>
  );
};

export default StatusBadge;
