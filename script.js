const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIKey = 'f2e2857506d180fdfd731ce61ed27120';

// List of all Nigerian cities
const nigerianCities = [
     "Abia",             "Umuahia",         
     "Adamawa",          "Yola",           
     "Akwa Ibom state",        "Uyo",             
     "Anambra",         "Awka",             
     "Bauchi",          "Bauchi",           
     "Bayelsa",         "Yenagoa",         
     "Benue",           "Makurdi",          
     "Borno",           "Maiduguri",         
     "Cross River",     "Calabar",          
     "Delta",           "Asaba",         
     "Ebonyi",          "Abakaliki",        
     "Edo",             "Benin City",        
     "Ekiti",           "Ado Ekiti",        
     "Enugu",           "Enugu",            
     "Gombe state",           "Gombe",             
     "Imo",             "Owerri",           
     "Jigawa",          "Dutse",            
     "Kaduna",          "Kaduna",           
     "Kano",            "Kano",              
     "Katsina",         "Katsina",          
     "Kebbi",           "Birnin Kebbi",     
     "Kogi",            "Lokoja",          
     "Kwara",           "Ilorin",            
     "Lagos",           "Ikeja",            
     "Nasarawa",        "Lafia",            
     "Niger state",           "Minna",           
     "Ogun",            "Abeokuta",         
     "Ondo",            "Akure",             
     "Osun",            "Oshogbo",         
     "Oyo",             "Ibadan",           
     "Plateau",         "Jos",              
     "Rivers state",          "Port Harcourt",    
     "Sokoto",          "Sokoto",           
     "Taraba state",          "Jalingo",           
     "Yobe state",            "Damaturu",        
     "Zamfara",         "Gusau",              
     "Abuja",           "Abuja"        
    ];

// Function to check if the city is in Nigeria
function isValidNigerianCity(city) {
    return nigerianCities.includes(city.trim());
}

// Function to get weather data
async function getWeather(city) {
    const cacheKey = `${city}`;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    const now = new Date().getTime();

    // Use cached data if it's less than 30 minutes old
    if (cachedData && (now - cachedData.timestamp < 30 * 60 * 1000)) {
        console.log('Using cached data');
        return cachedData.data;
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},NG&units=metric&appid=${APIKey}`);
    const data = await response.json();


    if (data.cod === 200) {
        // Cache the new data with a timestamp
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
    }

    return data;
}

// Function to update the weather display
async function updateWeather() {
    const city = document.getElementById('search-btn').value.trim();


    // Check if the city is valid (i.e., it's in the Nigerian cities list)
    if (city === '' || !nigerianCities.some(c => c.toLowerCase().trim() === city.toLowerCase())) {
        // Show the error message in the selected language on the "not-found" page
        
        // Display the "not-found" section
        container.style.height = '550px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        error404.classList.add('active');
        return;
    }

    const weatherData = await getWeather(city);

    if (weatherData.cod === 404) {

        container.style.height = '550px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        error404.classList.add('active');
        return;
    }

    container.style.height = '620px';
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');

    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    // Update weather information
    switch (weatherData.weather[0].main) {
        case 'Clear': image.src = 'images/clear.png'; break;
        case 'Rain': image.src = 'images/rain.png'; break;
        case 'Snow': image.src = 'images/snow.png'; break;
        case 'Clouds': image.src = 'images/cloud.png'; break;
        case 'Mist': image.src = 'images/mist.png'; break;
        default: image.src = 'images/clear.png';
    }
    
    temperature.innerHTML = `${parseInt(weatherData.main.temp)}<span>°C</span>`;
    description.innerHTML = `${weatherData.weather[0].description}`;
    humidity.innerHTML = `${weatherData.main.humidity}%`;
    wind.innerHTML = `${parseInt(weatherData.wind.speed)} Km/h`;
}

search.addEventListener('click', updateWeather);