import React, { FC } from "react";

interface FocusModalProps {
  onClose: (confirm: boolean) => void;
  message: string;
  type: "warning" | "success" | "danger";
}

const FocusModal: FC<FocusModalProps> = ({ message, type, onClose }) => {
  const getButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-warning hover:bg-warningsec";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-red-100";
      case "success":
        return "bg-green-100";
      default:
        return "bg-gray-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="size-14 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-14 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="fixed inset-0 opacity-75"></div>

      <div
        className={`absolute top-0 mt-4 w-full max-w-md mx-auto flex flex-row rounded-lg p-2 z-60 ${getBackgroundColor()}`}
      >
        <button
          className="absolute top-0 right-0 p-2 text-gray-400 bg-transparent hover:text-gray-900 rounded"
          onClick={() => onClose(false)}
        >
          ✕
        </button>
        <div className="flex-none items-center content-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1 pl-8">
          <h3 className="text font-normal pr-4 pt-4">{message}</h3>
          <div className="flex justify-end space-x-4">
            <button
              className={`btn btn-error ${getButtonColor()} p-2 text-white transition hover:scale-110 border-none outline-none h-6 min-h-8`}
              onClick={() => onClose(true)}
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModal;
