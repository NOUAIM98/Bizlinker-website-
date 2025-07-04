import React from "react";
import { useParams } from "react-router-dom";

const allEvents = [
  { id: 1, name: "Music Festival", city: "nicosia", date: "2025-04-10" },
  { id: 2, name: "Art Exhibition", city: "kyrenia", date: "2025-05-01" },
  { id: 3, name: "Food Fair", city: "famagusta", date: "2025-06-15" },
  { id: 4, name: "Tech Conference", city: "nicosia", date: "2025-07-20" },
  { id: 5, name: "Book Fair", city: "iskele", date: "2025-08-05" },
];

const EventList = () => {
  const { city } = useParams();
  const events = allEvents.filter((event) => event.city === city?.toLowerCase() || ""
    );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-center capitalize">
        Events in {city}
      </h2>
      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="p-4 bg-white shadow-lg rounded-xl">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-gray-600">Date: {event.date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No events found in {city}.</p>
      )}
    </div>
  );
};

export default EventList;
