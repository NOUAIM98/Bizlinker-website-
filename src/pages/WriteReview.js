import React, { useState, useEffect } from 'react';
import { Button, TextField, Rating, Box, Autocomplete, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { Style } from '@mui/icons-material';

const categories = ['Restaurants', 'Hotels', 'Shops', 'Services'];
const businesses = ['Business A', 'Business B', 'Business C', 'Business D'];

const WriteReview = () => {
    const [category, setCategory] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [business, setBusiness] = useState('');
    const [rating, setRating] = useState(3);
    const [date, setDate] = useState(dayjs());
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [photos, setPhotos] = useState(null);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [localBusinesses, setLocalBusinesses] = useState([]);

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const countryNames = response.data.map(country => country.name.common);
                setCountries(countryNames);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const fetchCities = (countryName) => {
        axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryName}/cities`, {
            headers: {
                'X-RapidAPI-Key': '501d9da3e2msh151817c024818adp1a96f6jsnf55dc94e3c39',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        })
            .then(response => {
                const cityNames = response.data.data.map(city => city.name);
                setCities(cityNames);
            })
            .catch(error => console.error('Error fetching cities:', error));
    };

    const fetchBusinesses = (cityName, category) => {
        axios.get(`https://api.example.com/businesses?city=${cityName}&category=${category}`, {
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY'
            }
        })
            .then(response => {
                const businessList = response.data.businesses.map(business => business.name);
                setLocalBusinesses(businessList);
            })
            .catch(error => console.error('Error fetching businesses:', error));
    };

    const handleCountryChange = (event, newValue) => {
        setCountry(newValue);
        fetchCities(newValue);
    };

    const handleCityChange = (event, newValue) => {
        setCity(newValue);
        if (newValue && category) {
            fetchBusinesses(newValue, category);
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        if (city && event.target.value) {
            fetchBusinesses(city, event.target.value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            category,
            country,
            city,
            business,
            rating,
            date,
            reviewTitle,
            reviewText,
            photos,
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: 'auto', maxWidth: 1000, height: '1200px', backgroundColor: '#fff'}}>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', p: 2 ,   }}>
                <h2>Write a review about your experience</h2>

                <Autocomplete
                    options={countries}
                    value={country}
                    onChange={handleCountryChange}
                    renderInput={(params) => <TextField {...params} label="Country" fullWidth margin="normal" />}
                />

                <Autocomplete
                    options={cities}
                    value={city}
                    onChange={handleCityChange}
                    renderInput={(params) => <TextField {...params} label="City" fullWidth margin="normal" />}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Choose a Category</InputLabel>
                    <Select
                        value={category}
                        onChange={handleCategoryChange}
                        label="Choose a Category"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Autocomplete
                    options={localBusinesses}
                    value={business}
                    onChange={(event, newValue) => setBusiness(newValue)}
                    renderInput={(params) => <TextField {...params} label="Business" fullWidth margin="normal" />}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <span>How would you rate your experience?</span>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        sx={{ ml: 2 }}
                    />
                </Box>

                <DatePicker
                    label="Date of experience"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" sx={{ alignItems: 'left', }} />}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Give your review a title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Write your review"
                    multiline
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />

                <Button variant="outlined" component="label" fullWidth sx={{ my: 2 , height: '50px'}}>
                    Click to add photos
                    <input type="file" hidden multiple onChange={(e) => setPhotos(e.target.files)} />
                </Button>

                <Box sx={{ fontSize: '12px', color: 'gray', mb: 2, textAlign: "left" }}>
                    By submitting this review, you confirm that it reflects your honest experience and was not influenced by any incentives.
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#FF5900", color: "#fffff", height: '50px', fontSize: '16px' }}
                    fullWidth
                >
                    Submit Review
                </Button>
            </Box>
          </Box>
        </LocalizationProvider>
    );
};

export default WriteReview;

