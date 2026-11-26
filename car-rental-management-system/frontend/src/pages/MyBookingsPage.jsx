import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <p className="p-10 text-center">
        Please <Link to="/login" className="text-primary underline">log in</Link> to see your bookings.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

      {loading && <p>Loading...</p>}
      {!loading && bookings.length === 0 && (
        <p>
          You have no bookings yet. <Link to="/cars" className="text-primary underline">Browse cars</Link>
        </p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div>
              <h3 className="font-semibold">{b.carId ? `${b.carId.brand} ${b.carId.name}` : "Car removed"}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">₹{b.totalAmount}</p>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookingsPage;
