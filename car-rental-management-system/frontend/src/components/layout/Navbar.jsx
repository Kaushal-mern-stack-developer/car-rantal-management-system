import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = "block py-2 hover:text-primary";
  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-white shadow dark:bg-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-primary">
          DriveEasy
        </Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>

        <div
          className={`${open ? "block" : "hidden"} absolute left-0 top-full w-full bg-white px-4 pb-3 shadow dark:bg-gray-800 md:static md:flex md:w-auto md:items-center md:gap-6 md:p-0 md:shadow-none`}
        >
          <Link to="/" className={linkClass} onClick={close}>Home</Link>
          <Link to="/#about" className={linkClass} onClick={close}>About</Link>
          <Link to="/cars" className={linkClass} onClick={close}>Cars</Link>
          {user && <Link to="/my-bookings" className={linkClass} onClick={close}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" className={linkClass} onClick={close}>Admin</Link>}

          <button onClick={toggleTheme} className={`${linkClass} text-left`}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          {user ? (
            <button onClick={handleLogout} className={`${linkClass} text-left`}>
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" className="mt-2 block rounded-md bg-primary px-4 py-2 text-center text-white md:mt-0" onClick={close}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
