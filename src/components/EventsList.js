import React from "react";
import events from "../data/events";
import Card from "./Card";
import "./EventsList.css";

const EventsList = () => {
    return (
        <div className="events-container">
            {events.map((event) => (
                <Card key={event.id} {...event} type="event" />
            ))}
        </div>
    );
};

export default EventsList;
