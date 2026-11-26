import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars, getErrorMessage } from "../../services/api.js";
import CarCard from "../cars/CarCard.jsx";

function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars()
      .then((data) => setCars(data.slice(0, 3)))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Popular Cars</h2>
      {error && <p className="mb-6 text-center text-red-500">{error}</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
      <p className="mt-8 text-center">
        <Link to="/cars" className="font-medium text-primary hover:underline">View all cars</Link>
      </p>
    </section>
  );
}

export default FeaturedCars;
