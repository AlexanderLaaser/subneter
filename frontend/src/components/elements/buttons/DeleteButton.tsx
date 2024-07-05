import { MdDelete } from "react-icons/md";

type StatusType = "active" | "inactive";

interface DeleteButtonProps {
  status: StatusType;
  onClickFunction: () => void;
  height?: string;
}

function DeleteButton({ status, onClickFunction, height }: DeleteButtonProps) {
  const buttonStyles =
    status === "active"
      ? "bg-warning transition duration-150 hover:scale-110 hover:bg-warningsec"
      : "bg-slate-300 text-slate-50 cursor-not-allowed";

  return (
    <div>
      <button
        className={`inline-flex items-center justify-center ${height} text-slate-50 rounded-lg focus:shadow-outline ${buttonStyles}`}
        onClick={status === "active" ? onClickFunction : undefined}
        disabled={status !== "active"}
      >
        <span className="h-4">
          <MdDelete />
        </span>
      </button>
    </div>
  );
}

export default DeleteButton;
