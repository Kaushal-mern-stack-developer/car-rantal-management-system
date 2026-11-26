import CarCard from "./CarCard.jsx";

function CarList({ cars }) {
  if (cars.length === 0) {
    return <p className="py-10 text-center text-gray-500">No cars are available for these filters.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  );
}

export default CarList;
