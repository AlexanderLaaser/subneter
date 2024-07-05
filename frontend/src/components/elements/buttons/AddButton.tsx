type StatusType = "active" | "inactive";

interface AddButtonProps {
  status: StatusType;
  onClickFunction: () => void;
  height?: string;
}

function AddButton({ status, onClickFunction, height }: AddButtonProps) {
  const buttonStyles =
    status === "active"
      ? "bg-primary transition duration-150 hover:scale-110 hover:bg-secondary"
      : "bg-slate-300 text-slate-50 cursor-not-allowed";

  return (
    <div>
      <button
        className={`inline-flex items-center justify-center ${height} text-slate-50 rounded-lg focus:shadow-outline ${buttonStyles}`}
        onClick={status === "active" ? onClickFunction : undefined}
        disabled={status !== "active"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 6v12m6-6H6"
          />
        </svg>
      </button>
    </div>
  );
}

export default AddButton;
