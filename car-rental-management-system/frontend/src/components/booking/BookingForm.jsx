import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { fetchCars, getErrorMessage } from "../../services/api.js";
import { validateBooking } from "../../utils/formValidation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700";

function BookingForm({ selectedCarId = "" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    phone: "",
    carId: selectedCarId,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [carsError, setCarsError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCars()
      .then((data) => setCars(data.filter((car) => car.isAvailable)))
      .catch((error) => setCarsError(error.response?.data?.message || "Could not load cars."));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedCar = cars.find((car) => car._id === form.carId);
  let days = 0;
  if (form.startDate && form.endDate && form.endDate > form.startDate) {
    days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24));
  }
  const total = selectedCar ? days * selectedCar.pricePerDay : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const foundErrors = validateBooking(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    try {
      setLoading(true);
      await api.post("/bookings", form);
      setShowModal(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/my-bookings");
  };

  const FieldError = ({ name }) => (errors[name] ? <p className="mt-1 text-sm text-red-500">{errors[name]}</p> : null);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input name="customerName" value={form.customerName} onChange={handleChange} className={inputClass} />
          <FieldError name="customerName" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className={inputClass} />
            <FieldError name="email" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="10 digit number" className={inputClass} />
            <FieldError name="phone" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Select car</label>
          {carsError && <p className="mb-1 text-sm text-red-500">{carsError}</p>}
          <select name="carId" value={form.carId} onChange={handleChange} className={inputClass}>
            <option value="">-- Choose a car --</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.brand} {car.name} - ₹{car.pricePerDay}/day
              </option>
            ))}
          </select>
          <FieldError name="carId" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Pickup date</label>
            <input type="date" name="startDate" min={today} value={form.startDate} onChange={handleChange} className={inputClass} />
            <FieldError name="startDate" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Return date</label>
            <input type="date" name="endDate" min={form.startDate || today} value={form.endDate} onChange={handleChange} className={inputClass} />
            <FieldError name="endDate" />
          </div>
        </div>

        {total > 0 && (
          <p className="rounded-md bg-primary-light p-3 text-sm font-medium text-primary-dark">
            {days} day(s) x ₹{selectedCar.pricePerDay} = Total ₹{total}
          </p>
        )}

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </form>

      <Modal
        isOpen={showModal}
        title="Booking received"
        message="Your booking was submitted. You can check its status in My Bookings."
        onClose={handleModalClose}
      />
    </>
  );
}

export default BookingForm;
