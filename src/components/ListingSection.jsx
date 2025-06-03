// src/components/ListingSection.jsx
import ListingCard from "./ListingCard";

const dummyListings = {
  sale: [
    { id: 1, title: "Bike", description: "Used mountain bike in good condition" },
    { id: 2, title: "Microwave", description: "800W, barely used" },
  ],
  rent: [
    { id: 1, title: "Room in Falmer", description: "5-min walk to Sussex campus" },
    { id: 2, title: "Studio", description: "Close to Brighton station" },
  ],
  services: [
    { id: 1, title: "Math Tutoring", description: "Year 1 support for Sussex students" },
    { id: 2, title: "Flatmate Help", description: "Need assistance moving furniture" },
  ],
};

export default function ListingSection({ title, category }) {
  const listings = dummyListings[category] || [];

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {listings.map((item) => (
          <ListingCard key={item.id} title={item.title} description={item.description} />
        ))}
      </div>
    </section>
  );
}
