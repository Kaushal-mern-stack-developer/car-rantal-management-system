const styles = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white",
  danger: "bg-red-600 text-white hover:bg-red-700",
  light: "bg-white text-primary hover:bg-primary-light",
};

function Button({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
