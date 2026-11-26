import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import { isValidEmail } from "../utils/formValidation.js";
import Button from "../components/common/Button.jsx";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700";

function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && !form.name.trim()) return setError("Name is required");
    if (!isValidEmail(form.email)) return setError("Enter a valid email");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");

    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Create account"}</h1>

        {!isLogin && (
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className={inputClass} />
        )}
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full">{isLogin ? "Login" : "Sign up"}</Button>

        <p className="text-center text-sm">
          {isLogin ? "New here? " : "Already have an account? "}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} className="font-medium text-primary underline">
            {isLogin ? "Create an account" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginSignupPage;
