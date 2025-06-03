// src/components/Navbar.jsx
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-semibold">South Coast Unis Marketplace</h1>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="text-gray-700 border px-3 py-1 rounded hover:bg-gray-100"
        >
          Menu
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Buy Items
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Request a Service
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              List a Wanted Service
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
