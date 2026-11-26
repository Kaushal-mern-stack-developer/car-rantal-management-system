import { useEffect, useState } from "react";
import { fetchCars, getErrorMessage } from "../services/api.js";
import SearchFilter from "../components/cars/SearchFilter.jsx";
import CarList from "../components/cars/CarList.jsx";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "", fuelType: "", maxPrice: "" });

  useEffect(() => {
    fetchCars().then(setCars).catch((requestError) => setError(getErrorMessage(requestError)));
  }, []);

  const filteredCars = cars.filter((car) => {
    const text = `${car.name} ${car.brand} ${car.carModel}`.toLowerCase();
    if (filters.search && !text.includes(filters.search.toLowerCase())) return false;
    if (filters.category && car.category !== filters.category) return false;
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
    if (filters.maxPrice && car.pricePerDay > Number(filters.maxPrice)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Our Cars</h1>
      <SearchFilter filters={filters} setFilters={setFilters} />
      {error ? <p className="py-10 text-center text-red-500">{error}</p> : <CarList cars={filteredCars} />}
    </div>
  );
}

export default CarsPage;
