import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/common/Button.jsx";

const emptyCar = {
  name: "",
  carModel: "",
  brand: "",
  pricePerDay: "",
  fuelType: "Petrol",
  seats: 5,
  category: "Economy",
  image: "",
  isAvailable: true,
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700";

function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("cars");
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyCar);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const carsRes = await api.get("/cars");
      const bookingsRes = await api.get("/bookings");
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/login" />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = { ...form, pricePerDay: Number(form.pricePerDay), seats: Number(form.seats) };
      if (editingId) {
        await api.put(`/cars/${editingId}`, data);
      } else {
        await api.post("/cars", data);
      }
      setForm(emptyCar);
      setEditingId(null);
      loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleEdit = (car) => {
    setForm(car);
    setEditingId(car._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await api.delete(`/cars/${id}`);
      loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const tabClass = (name) =>
    `rounded-md px-4 py-2 text-sm font-medium ${
      tab === name ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-6 flex gap-3">
        <button className={tabClass("cars")} onClick={() => setTab("cars")}>Manage Cars</button>
        <button className={tabClass("bookings")} onClick={() => setTab("bookings")}>All Bookings</button>
      </div>

      {message && <p className="mb-4 text-red-500">{message}</p>}

      {tab === "cars" && (
        <>
          <form onSubmit={handleSubmit} className="mb-8 grid gap-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:grid-cols-2 lg:grid-cols-4">
            <h2 className="font-semibold sm:col-span-2 lg:col-span-4">{editingId ? "Edit car" : "Add a new car"}</h2>
            <input name="name" placeholder="Car name" value={form.name} onChange={handleChange} required className={inputClass} />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required className={inputClass} />
            <input name="carModel" placeholder="Model (e.g. VXi 2023)" value={form.carModel} onChange={handleChange} required className={inputClass} />
            <input type="number" name="pricePerDay" placeholder="Price per day" value={form.pricePerDay} onChange={handleChange} required className={inputClass} />
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className={inputClass}>
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </select>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option>Economy</option><option>SUV</option><option>Luxury</option><option>Sports</option>
            </select>
            <input type="number" name="seats" placeholder="Seats" value={form.seats} onChange={handleChange} className={inputClass} />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className={inputClass} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
              Available
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <Button type="submit">{editingId ? "Update car" : "Add car"}</Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setForm(emptyCar); setEditingId(null); }}>Cancel</Button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3">Car</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price/day</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{car.brand} {car.name}</td>
                    <td className="p-3">{car.category}</td>
                    <td className="p-3">₹{car.pricePerDay}</td>
                    <td className="p-3">{car.isAvailable ? "Available" : "Not available"}</td>
                    <td className="flex gap-2 p-3">
                      <Button variant="outline" onClick={() => handleEdit(car)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(car._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "bookings" && (
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Car</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr><td className="p-3" colSpan="6">No bookings yet.</td></tr>
              )}
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3">{b.customerName}</td>
                  <td className="p-3">{b.email}<br />{b.phone}</td>
                  <td className="p-3">{b.carId ? `${b.carId.brand} ${b.carId.name}` : "Car removed"}</td>
                  <td className="p-3">
                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">₹{b.totalAmount}</td>
                  <td className="p-3">
                    <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className={inputClass}>
                      <option>Pending</option><option>Confirmed</option><option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
