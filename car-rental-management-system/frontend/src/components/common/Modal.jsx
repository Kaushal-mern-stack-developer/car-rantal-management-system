import Button from "./Button.jsx";

function Modal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
}

export default Modal;
