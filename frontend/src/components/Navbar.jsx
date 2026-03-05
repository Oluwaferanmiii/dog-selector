import { Link } from "react-router-dom";
import pawIcon from "../assets/dog-paw.svg";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <div className="d-flex align-items-center gap-4">

        {/* Logo + title */}
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none text-dark"
        >
          <img src={pawIcon} alt="logo" width="24" height="24" />
          <span className="fw-semibold">Dog Selector</span>
        </Link>

        {/* Contact link */}
        <Link
          to="/contact"
          className="text-muted text-decoration-none"
        >
          Contact Us
        </Link>

      </div>
    </nav>
  );
}