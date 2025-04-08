const API_KEY = '3bf9b9be9a52c7f716a54fc1c069c003';
const countrySelect = document.getElementById('countrySelect');
const stateSelect = document.getElementById('stateSelect');
let citySelect = document.getElementById('citySelect');
const getWeatherBtn = document.getElementById('getWeather');
const weatherCard = document.querySelector('.weather-card');
const errorMessage = document.querySelector('.error-message');
const weatherContent = document.querySelector('.weather-content');

// Country data
const countries = {
    "US": "United States",
    "GB": "United Kingdom",
    "CA": "Canada",
    "AU": "Australia",
    "IN": "India"
};

// Populate countries
Object.entries(countries).forEach(([code, name]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    countrySelect.appendChild(option);
});

// Complete list of Indian states
const states = {
    "US": {
        "NY": "New York",
        "CA": "California",
        "TX": "Texas",
        "FL": "Florida"
    },
    "IN": {
        "AP": "Andhra Pradesh",
        "AR": "Arunachal Pradesh",
        "AS": "Assam",
        "BR": "Bihar",
        "CT": "Chhattisgarh",
        "GA": "Goa",
        "GJ": "Gujarat",
        "HR": "Haryana",
        "HP": "Himachal Pradesh",
        "JH": "Jharkhand",
        "KA": "Karnataka",
        "KL": "Kerala",
        "MP": "Madhya Pradesh",
        "MH": "Maharashtra",
        "MN": "Manipur",
        "ML": "Meghalaya",
        "MZ": "Mizoram",
        "NL": "Nagaland",
        "OR": "Odisha",
        "PB": "Punjab",
        "RJ": "Rajasthan",
        "SK": "Sikkim",
        "TN": "Tamil Nadu",
        "TG": "Telangana",
        "TR": "Tripura",
        "UT": "Uttarakhand",
        "UP": "Uttar Pradesh",
        "WB": "West Bengal",
        "AN": "Andaman and Nicobar Islands",
        "CH": "Chandigarh",
        "DN": "Dadra and Nagar Haveli and Daman and Diu",
        "DL": "Delhi",
        "JK": "Jammu and Kashmir",
        "LA": "Ladakh",
        "LD": "Lakshadweep",
        "PY": "Puducherry"
    }
};

// Sample cities for non-Indian states
const cities = {
    "NY": ["New York City", "Buffalo", "Albany"],
    "CA": ["Los Angeles", "San Francisco", "San Diego"],
    "TX": ["Houston", "Austin", "Dallas"],
    "FL": ["Miami", "Orlando", "Tampa"]
};

// Event Listeners
countrySelect.addEventListener('change', (e) => {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (e.target.value) {
        stateSelect.disabled = false;
        const countryStates = states[e.target.value] || {};
        Object.entries(countryStates).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            stateSelect.appendChild(option);
        });

        // If India is selected, change city select to input
        if (e.target.value === 'IN') {
            convertCitySelectToInput();
        } else {
            convertCityInputToSelect();
        }
    } else {
        stateSelect.disabled = true;
        citySelect.disabled = true;
    }
});

stateSelect.addEventListener('change', (e) => {
    if (countrySelect.value !== 'IN') {
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (e.target.value) {
            citySelect.disabled = false;
            const stateCities = cities[e.target.value] || [];
            stateCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
    } else {
        citySelect.disabled = false;
    }
});

function convertCitySelectToInput() {
    const container = citySelect.parentElement;
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = 'citySelect';
    newInput.placeholder = 'Enter city name';
    newInput.className = citySelect.className;
    container.replaceChild(newInput, citySelect);
    citySelect = newInput;
}

function convertCityInputToSelect() {
    const container = citySelect.parentElement;
    const newSelect = document.createElement('select');
    newSelect.id = 'citySelect';
    newSelect.innerHTML = '<option value="">Select City</option>';
    newSelect.className = citySelect.className;
    container.replaceChild(newSelect, citySelect);
    citySelect = newSelect;
    citySelect.disabled = true;
}

function showError(message) {
    weatherCard.classList.remove('hidden');
    errorMessage.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.textContent = message;
}

function hideError() {
    errorMessage.classList.add('hidden');
    weatherContent.classList.remove('hidden');
}

getWeatherBtn.addEventListener('click', async () => {
    const selectedCity = citySelect.value;
    if (!selectedCity) {
        showError('Please enter or select a city');
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            hideError();
            displayWeather(data);
        } else {
            showError('City not found. Please check the city name and try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error fetching weather data. Please try again.');
    }
});

function displayWeather(data) {
    weatherCard.classList.remove('hidden');
    
    const cityName = document.querySelector('.city-name');
    const temperature = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const weatherIcon = document.querySelector('.weather-icon');

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description.charAt(0).toUpperCase() + 
                            data.weather[0].description.slice(1);
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}