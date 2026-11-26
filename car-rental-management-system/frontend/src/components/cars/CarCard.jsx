import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

function CarCard({ car }) {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/cars/placeholder.svg";
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <img
        src={car.image || "/images/cars/placeholder.svg"}
        alt={car.name}
        onError={handleImageError}
        className="h-44 w-full object-cover"
      />
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{car.brand} {car.name}</h3>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
              car.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {car.isAvailable ? "Available" : "Not available"}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {car.category} | {car.fuelType} | {car.seats} seats
        </p>
        <p className="mb-4 text-xl font-bold text-primary">
          ₹{car.pricePerDay} <span className="text-sm font-normal text-gray-500">/ day</span>
        </p>
        <div className="flex gap-2">
          <Link to={`/cars/${car._id}`}><Button variant="outline">Details</Button></Link>
          {car.isAvailable && (
            <Link to={`/booking?carId=${car._id}`}><Button>Book Now</Button></Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarCard;
