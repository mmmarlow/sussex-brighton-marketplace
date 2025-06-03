// src/components/ListingCard.jsx
export default function ListingCard({ title, description }) {
    return (
      <div className="min-w-[200px] bg-white p-4 rounded shadow hover:shadow-md transition-all">
        <div className="h-32 bg-gray-200 mb-3 rounded"></div> {/* Placeholder for image */}
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }
  