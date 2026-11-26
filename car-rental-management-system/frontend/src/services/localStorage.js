export const saveTheme = (theme) => localStorage.setItem("theme", theme);
export const getTheme = () => localStorage.getItem("theme") || "light";

export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => {
  const saved = localStorage.getItem("user");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};
export const removeUser = () => localStorage.removeItem("user");
