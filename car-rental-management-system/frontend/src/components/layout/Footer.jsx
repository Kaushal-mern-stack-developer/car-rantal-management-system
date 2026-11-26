import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-bold text-white">DriveEasy</h3>
          <p className="text-sm">Simple and affordable car rentals for every trip.</p>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-white">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/cars" className="hover:text-white">Cars</Link></li>
            <li><Link to="/booking" className="hover:text-white">Book a Car</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-white">Contact</h3>
          <p className="text-sm">Email: kaushalfumakiya9@gmail.com</p>
          <p className="text-sm">Phone: 9327229447</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
