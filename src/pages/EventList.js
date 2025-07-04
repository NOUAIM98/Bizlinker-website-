import React from "react";
import CardList from "./CardList";
import { events } from "./events"; 

const EventList = () => {
    return <CardList title="Upcoming Events" cards={events} />;
};

export default EventList;
