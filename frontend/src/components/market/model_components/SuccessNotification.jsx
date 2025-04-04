import React from "react";

const SuccessNotification = () => {
  return (
    <div
      id="notification"
      className="hidden fixed bottom-4 right-4 bg-green-900 text-green-100 p-4 rounded-lg shadow-lg border border-green-700 max-w-sm"
    >
      <div className="flex items-center">
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <div>
          <h4 className="font-bold">Bet Placed Successfully!</h4>
          <p className="text-sm text-green-200">
            Your bet has been confirmed on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;