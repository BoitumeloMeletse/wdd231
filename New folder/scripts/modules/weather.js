// Weather module for fetching and displaying weather data

// Fetch weather data
export async function fetchWeather(location = 'default') {
    try {
        // For demo purposes, we'll try to use the OpenWeatherMap API
        // If it fails, we'll fall back to mock data
        const apiKey = "7c496c391c202d7f7a1eee1a6f91630a"; 
        
        // Default to a mountain location if none specified
        const city = location === 'default' ? "Boulder" : location;
        
        // Show loading state
        return await getWeatherFromAPI(city, apiKey);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fall back to mock data
        return getMockWeather(location);
    }
}

// Get weather data from OpenWeatherMap API
async function getWeatherFromAPI(city, apiKey) {
    try {
        // Build URLs for API requests
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

        // Try to fetch current weather
        let currentData;
        try {
            // Use a more reliable fetch method with timeout
            const currentResponse = await fetchWithTimeout(currentWeatherUrl);
            currentData = await currentResponse.json();
            console.log("Current weather data:", currentData);
        } catch (error) {
            console.error("Error fetching current weather:", error);
            // If API fails, use mock data
            throw new Error("Failed to fetch current weather");
        }

        // Try to fetch forecast
        let forecastData;
        try {
            const forecastResponse = await fetchWithTimeout(forecastUrl);
            forecastData = await forecastResponse.json();
            console.log("Forecast data:", forecastData);
        } catch (error) {
            console.error("Error fetching forecast:", error);
            // If API fails, use mock data
            throw new Error("Failed to fetch forecast");
        }

        // Process current weather
        const current = {
            temp: currentData.main.temp,
            description: currentData.weather[0].description,
            icon: getIconName(currentData.weather[0].icon),
            location: currentData.name
        };

        // Process forecast
        const forecast = [];
        const today = new Date();

        // If we have real forecast data, process it
        if (forecastData.list) {
            // Get unique days from the forecast data
            const uniqueDays = new Set();
            let dayCount = 0;

            for (const item of forecastData.list) {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString("en-US", { weekday: "short" });

                // Skip today and only include noon forecasts (around 12:00)
                if (date.getDate() > today.getDate() && date.getHours() >= 11 && date.getHours() <= 13) {
                    if (!uniqueDays.has(day) && dayCount < 3) {
                        uniqueDays.add(day);
                        dayCount++;

                        forecast.push({
                            day,
                            temp: item.main.temp,
                            icon: getIconName(item.weather[0].icon),
                        });
                    }
                }
            }
        }

        // If we couldn't get 3 days from the API, fill in with mock data
        if (forecast.length < 3) {
            const mockForecast = getMockForecast();
            for (let i = forecast.length; i < 3; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() + i + 1);

                forecast.push({
                    day: date.toLocaleDateString("en-US", { weekday: "short" }),
                    temp: mockForecast.list[i].main.temp,
                    icon: getIconName(mockForecast.list[i].weather[0].icon),
                });
            }
        }

        return { current, forecast };
    } catch (error) {
        console.error("Error with weather API:", error);
        throw error;
    }
}

// Helper function: Fetch with timeout to prevent hanging requests
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Helper function to map OpenWeatherMap icons to our icon names
function getIconName(iconCode) {
    const iconMap = {
        "01d": "sun",
        "01n": "moon",
        "02d": "cloud-sun",
        "02n": "cloud-moon",
        "03d": "cloud",
        "03n": "cloud",
        "04d": "cloud",
        "04n": "cloud",
        "09d": "cloud-rain",
        "09n": "cloud-rain",
        "10d": "cloud-rain",
        "10n": "cloud-rain",
        "11d": "bolt",
        "11n": "bolt",
        "13d": "snowflake",
        "13n": "snowflake",
        "50d": "cloud",
        "50n": "cloud",
    };

    return iconMap[iconCode] || "cloud";
}

// Display weather data in the specified container
export function displayWeather(weatherData, container) {
    if (!weatherData || !weatherData.current) {
        container.innerHTML = '<p>No weather data available.</p>';
        return;
    }
    
    // Function to capitalize each word in a string
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Format temperature without decimal points
    const formatTemp = (temp) => {
        return Math.round(temp);
    };
    
    // Build weather HTML
    const weatherHTML = `
        <div class="current-weather">
            <div class="weather-info">
                <div class="weather-icon">
                    <i class="weather-icon-${weatherData.current.icon}"></i>
                </div>
                <div>
                    <div class="temperature">${formatTemp(weatherData.current.temp)}°F</div>
                    <div class="weather-description">${capitalizeWords(weatherData.current.description)}</div>
                    <div class="weather-location">${weatherData.current.location || 'Mountain Area'}</div>
                </div>
            </div>
        </div>
        
        <h3 class="forecast-title">3-Day Forecast</h3>
        <div class="forecast-container">
            ${weatherData.forecast.map(day => `
                <div class="forecast-day">
                    <div class="forecast-date">${day.day}</div>
                    <div class="forecast-icon"><i class="weather-icon-${day.icon}"></i></div>
                    <div class="forecast-temp">${formatTemp(day.temp)}°F</div>
                </div>
            `).join('')}
        </div>
        
        <div class="weather-note">
            <small>Weather data powered by OpenWeatherMap</small>
        </div>
    `;

    // Clear loading message
    container.innerHTML = weatherHTML;
    
    // Add weather icon classes
    addWeatherIconClasses();
}

// Add CSS classes for weather icons
function addWeatherIconClasses() {
    const style = document.createElement('style');
    style.textContent = `
        .weather-icon-sun::before { content: '☀️'; }
        .weather-icon-moon::before { content: '🌙'; }
        .weather-icon-cloud-sun::before { content: '⛅'; }
        .weather-icon-cloud-moon::before { content: '☁️'; }
        .weather-icon-cloud::before { content: '☁️'; }
        .weather-icon-cloud-rain::before { content: '🌧️'; }
        .weather-icon-bolt::before { content: '⚡'; }
        .weather-icon-snowflake::before { content: '❄️'; }
    `;
    document.head.appendChild(style);
}

// Mock weather data
function getMockWeather(location) {
    const current = {
        temp: 68.5,
        description: "partly cloudy",
        icon: "cloud-sun",
        location: location === 'default' ? "Mountain Area" : location
    };
    
    const forecast = [
        {
            day: "Mon",
            temp: 72.3,
            icon: "sun"
        },
        {
            day: "Tue",
            temp: 65.8,
            icon: "cloud"
        },
        {
            day: "Wed",
            temp: 70.1,
            icon: "cloud-sun"
        }
    ];
    
    return { current, forecast };
}

// Helper function: Get mock forecast data
function getMockForecast() {
    return {
        list: [
            {
                dt: Date.now() / 1000 + 86400,
                main: {
                    temp: 74.3,
                },
                weather: [
                    {
                        id: 800,
                        main: "Clear",
                        description: "clear sky",
                        icon: "01d",
                    },
                ],
            },
            {
                dt: Date.now() / 1000 + 172800,
                main: {
                    temp: 68.7,
                },
                weather: [
                    {
                        id: 500,
                        main: "Rain",
                        description: "light rain",
                        icon: "10d",
                    },
                ],
            },
            {
                dt: Date.now() / 1000 + 259200,
                main: {
                    temp: 71.2,
                },
                weather: [
                    {
                        id: 803,
                        main: "Clouds",
                        description: "broken clouds",
                        icon: "04d",
                    },
                ],
            },
        ],
    };
}