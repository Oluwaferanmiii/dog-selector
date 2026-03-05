import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import DogsPage from "./pages/DogsPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dogs" replace />} />
        <Route path="/dogs" element={<DogsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}