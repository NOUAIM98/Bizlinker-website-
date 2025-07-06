import React from "react";
import Card from "./Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Card.css";

const CardList = ({ title, cards }) => {
    return (
        <div className="card-list">
            <h2>{title}</h2>
            <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={8}
                slidesPerView={1.2}
                breakpoints={{
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 8
                    },
                    375: {
                        slidesPerView: 1.3,
                        spaceBetween: 8
                    },
                    414: {
                        slidesPerView: 1.4,
                        spaceBetween: 8
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    }
                }}
                navigation={true}
                grabCursor={true}
                loop={true}
            >
                {cards.map((card) => (
                    <SwiperSlide key={card.id}>
                        <Card {...card} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CardList;
