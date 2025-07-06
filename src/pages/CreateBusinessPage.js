import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBusinessPage = () => {
    const [businessData, setBusinessData] = useState({
        name: "",
        breadcrumb: "",
        rating: "",
        reviews: "",
        website: "",
        phone: "",
        email: "",
        hours: "",
        status: "",
        about: "",
        location: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessData({ ...businessData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/business", { state: businessData });
    };

    return (
        <div className="container">
            <h1>Create a New Business</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={businessData.name} onChange={handleChange} required />

                <label>Breadcrumb:</label>
                <input type="text" name="breadcrumb" value={businessData.breadcrumb} onChange={handleChange} />

                <label>Rating:</label>
                <input type="number" name="rating" value={businessData.rating} onChange={handleChange} required />

                <label>Reviews:</label>
                <input type="number" name="reviews" value={businessData.reviews} onChange={handleChange} />

                <label>Website:</label>
                <input type="url" name="website" value={businessData.website} onChange={handleChange} required />

                <label>Phone:</label>
                <input type="text" name="phone" value={businessData.phone} onChange={handleChange} />

                <label>Email:</label>
                <input type="email" name="email" value={businessData.email} onChange={handleChange} />

                <label>Hours:</label>
                <input type="text" name="hours" value={businessData.hours} onChange={handleChange} />

                <label>Status:</label>
                <input type="text" name="status" value={businessData.status} onChange={handleChange} />

                <label>About:</label>
                <textarea name="about" value={businessData.about} onChange={handleChange}></textarea>

                <label>Location:</label>
                <input type="text" name="location" value={businessData.location} onChange={handleChange} />

                <button type="submit">Create Business</button>
            </form>
        </div>
    );
};

export default CreateBusinessPage;
