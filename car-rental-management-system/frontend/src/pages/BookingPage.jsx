import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BookingForm from "../components/booking/BookingForm.jsx";

function BookingPage() {
  const [params] = useSearchParams();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Book a Car</h1>
      {user ? (
        <BookingForm selectedCarId={params.get("carId") || ""} />
      ) : (
        <p className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          Please <Link to="/login" className="font-medium text-primary underline">log in</Link> to book a car.
        </p>
      )}
    </div>
  );
}

export default BookingPage;
