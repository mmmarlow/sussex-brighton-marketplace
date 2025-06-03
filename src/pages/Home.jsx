// src/pages/Home.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ListingSection from "../components/ListingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search and Filters */}
      <div className="px-4 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full sm:w-1/2 p-2 border rounded"
        />
        <select className="w-full sm:w-1/4 p-2 border rounded">
          <option value="">All Categories</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="services">Services Requested</option>
        </select>
      </div>

      {/* Sections */}
      <ListingSection title="Items for Sale" category="sale" />
      <ListingSection title="Items for Rent" category="rent" />
      <ListingSection title="Services Requested" category="services" />
    </div>
  );
}
