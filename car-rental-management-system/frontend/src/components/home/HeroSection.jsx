import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

function HeroSection() {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Rent the right car for your next trip</h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-teal-50">
          Choose from economy cars, SUVs and luxury rides. Pick your dates and book in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/cars"><Button variant="light">Browse Cars</Button></Link>
          <Link to="/booking">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
