import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCars, getErrorMessage } from "../services/api.js";
import Button from "../components/common/Button.jsx";

function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars()
      .then((cars) => setCar(cars.find((c) => c._id === id) || null))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!car) return <p className="p-10 text-center">Car not found.</p>;

  const specs = [
    ["Brand", car.brand],
    ["Model", car.carModel],
    ["Category", car.category],
    ["Fuel type", car.fuelType],
    ["Seats", car.seats],
    ["Status", car.isAvailable ? "Available" : "Not available"],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/cars" className="text-sm text-primary hover:underline">Back to cars</Link>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <img
          src={car.image || "/images/cars/placeholder.svg"}
          alt={car.name}
          onError={(e) => { e.target.onerror = null; e.target.src = "/images/cars/placeholder.svg"; }}
          className="w-full rounded-lg object-cover shadow"
        />
        <div>
          <h1 className="mb-2 text-3xl font-bold">{car.name}</h1>
          <p className="mb-6 text-2xl font-bold text-primary">₹{car.pricePerDay} / day</p>
          <table className="mb-6 w-full text-left text-sm">
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label} className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 font-medium text-gray-500 dark:text-gray-400">{label}</th>
                  <td className="py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {car.isAvailable ? (
            <Link to={`/booking?carId=${car._id}`}><Button>Book This Car</Button></Link>
          ) : (
            <p className="text-red-500">This car cannot be booked right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarDetailsPage;
