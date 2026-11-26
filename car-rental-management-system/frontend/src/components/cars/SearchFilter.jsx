const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700";

function SearchFilter({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 grid gap-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by name, brand or model"
        className={inputClass}
      />
      <select name="category" value={filters.category} onChange={handleChange} className={inputClass}>
        <option value="">All categories</option>
        <option value="Economy">Economy</option>
        <option value="SUV">SUV</option>
        <option value="Luxury">Luxury</option>
        <option value="Sports">Sports</option>
      </select>
      <select name="fuelType" value={filters.fuelType} onChange={handleChange} className={inputClass}>
        <option value="">All fuel types</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      <select name="maxPrice" value={filters.maxPrice} onChange={handleChange} className={inputClass}>
        <option value="">Any price</option>
        <option value="2000">Up to ₹2000 / day</option>
        <option value="4000">Up to ₹4000 / day</option>
        <option value="8000">Up to ₹8000 / day</option>
      </select>
    </div>
  );
}

export default SearchFilter;
