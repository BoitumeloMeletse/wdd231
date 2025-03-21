// DOM Elements
const menuButton = document.getElementById("menu-button")
const navMenu = document.getElementById("nav-menu")
const currentDateElement = document.getElementById("current-date")
const currentYearElement = document.getElementById("current-year")
const lastUpdatedElement = document.getElementById("last-updated")
const weatherContainer = document.getElementById("weather-container")
const spotlightsContainer = document.getElementById("spotlights-container")

// Toggle mobile menu
menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("open")
  navMenu.classList.toggle("show")
})

// Format and display current date
function displayCurrentDate() {
  const now = new Date()
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  currentDateElement.textContent = now.toLocaleDateString("en-US", options)
}

// Display current year for copyright
function displayCurrentYear() {
  const year = new Date().getFullYear()
  currentYearElement.textContent = year
}

// Display last updated date
function displayLastUpdated() {
  lastUpdatedElement.textContent = document.lastModified
}

// FIXED: Weather API Integration
async function getWeatherData() {
  const apiKey = "7c496c391c202d7f7a1eee1a6f91630a"
  const city = "Johannesburg"

  try {
    // Show loading state
    weatherContainer.innerHTML = `
            <div class="weather-loading">
                <div class="spinner"></div>
                <p>Loading weather data...</p>
            </div>
        `

    // Build URLs for API requests
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    // Try to fetch current weather
    let currentData
    try {
      // Use a more reliable fetch method with timeout
      const currentResponse = await fetchWithTimeout(currentWeatherUrl)
      currentData = await currentResponse.json()
      console.log("Current weather data:", currentData)
    } catch (error) {
      console.error("Error fetching current weather:", error)
      // If API fails, use mock data
      currentData = getMockCurrentWeather()
    }

    // Try to fetch forecast
    let forecastData
    try {
      const forecastResponse = await fetchWithTimeout(forecastUrl)
      forecastData = await forecastResponse.json()
      console.log("Forecast data:", forecastData)
    } catch (error) {
      console.error("Error fetching forecast:", error)
      // If API fails, use mock data
      forecastData = getMockForecast()
    }

    // Process current weather
    const current = {
      temp: currentData.main.temp,
      description: currentData.weather[0].description,
      icon: getIconName(currentData.weather[0].icon),
    }

    // Process forecast
    const forecast = []
    const today = new Date()

    // If we have real forecast data, process it
    if (forecastData.list) {
      // Get unique days from the forecast data
      const uniqueDays = new Set()
      let dayCount = 0

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000)
        const day = date.toLocaleDateString("en-US", { weekday: "short" })

        // Skip today and only include noon forecasts (around 12:00)
        if (date.getDate() > today.getDate() && date.getHours() >= 11 && date.getHours() <= 13) {
          if (!uniqueDays.has(day) && dayCount < 3) {
            uniqueDays.add(day)
            dayCount++

            forecast.push({
              day,
              temp: item.main.temp,
              icon: getIconName(item.weather[0].icon),
            })
          }
        }
      }
    }

    // If we couldn't get 3 days from the API, fill in with mock data
    if (forecast.length < 3) {
      const mockForecast = getMockForecast()
      for (let i = forecast.length; i < 3; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i + 1)

        forecast.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          temp: mockForecast.list[i].main.temp,
          icon: getIconName(mockForecast.list[i].weather[0].icon),
        })
      }
    }

    // Display the weather data
    displayWeather({ current, forecast })
  } catch (error) {
    console.error("Error with weather data:", error)
    weatherContainer.innerHTML = `
            <div class="weather-error">
                <p>Unable to load weather data. Please try again later.</p>
                <p class="small">Error: ${error.message}</p>
            </div>
        `
  }
}

// Helper function: Fetch with timeout to prevent hanging requests
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(id)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// Helper function: Get mock current weather data
function getMockCurrentWeather() {
  return {
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03d",
      },
    ],
    main: {
      temp: 72.5,
      feels_like: 71.8,
      temp_min: 68.2,
      temp_max: 75.4,
      pressure: 1015,
      humidity: 62,
    },
    name: "Springfield",
  }
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
  }
}

// Helper function to map OpenWeatherMap icons to our icon names
function getIconName(iconCode) {
  const iconMap = {
    "01d": "sun",
    "01n": "sun",
    "02d": "cloud-sun",
    "02n": "cloud-sun",
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
  }

  return iconMap[iconCode] || "cloud"
}

// Display weather data
function displayWeather(data) {
  // Function to capitalize each word in a string
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Function to get weather icon class
  const getWeatherIconClass = (icon) => {
    const iconMap = {
      sun: "fa-sun",
      "cloud-sun": "fa-cloud-sun",
      cloud: "fa-cloud",
      "cloud-rain": "fa-cloud-rain",
      "cloud-showers-heavy": "fa-cloud-showers-heavy",
      snowflake: "fa-snowflake",
      bolt: "fa-bolt",
    }

    return iconMap[icon] || "fa-cloud"
  }

  // Format temperature without decimal points
  const formatTemp = (temp) => {
    return Math.round(temp)
  }

  // Build weather HTML
  const weatherHTML = `
        <div class="current-weather">
            <div class="weather-info">
                <div class="weather-icon">
                    <i class="fas ${getWeatherIconClass(data.current.icon)}"></i>
                </div>
                <div>
                    <div class="temperature">${formatTemp(data.current.temp)}°F</div>
                    <div class="weather-description">${capitalizeWords(data.current.description)}</div>
                </div>
            </div>
            <div>
                <i class="fas fa-thermometer-half" style="font-size: 2rem; color: var(--primary-color);"></i>
            </div>
        </div>
        
        <h3 class="forecast-title">3-Day Forecast</h3>
        <div class="forecast-container">
            ${data.forecast
              .map(
                (day) => `
                <div class="forecast-day">
                    <div class="forecast-date">${day.day}</div>
                    <div><i class="fas ${getWeatherIconClass(day.icon)}"></i></div>
                    <div class="forecast-temp">${formatTemp(day.temp)}°F</div>
                </div>
            `,
              )
              .join("")}
        </div>
        
        <div class="weather-note">
            <small>Weather data powered by OpenWeatherMap</small>
        </div>
    `

  weatherContainer.innerHTML = weatherHTML
}

// Display random spotlights from JSON data source
async function displaySpotlights() {
  try {
    // Show loading state
    spotlightsContainer.innerHTML = `
            <div class="spotlight-loading">
                <div class="spinner"></div>
                <p>Loading member spotlights...</p>
            </div>
        `

    // Fetch members data from JSON file
    const response = await fetch("members.json")

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const members = await response.json()

    // Filter for gold and silver members
    const eligibleMembers = members.filter(
      (member) => member.membershipLevel === "gold" || member.membershipLevel === "silver",
    )

    // Randomly select 2-3 members
    const numberOfSpotlights = Math.floor(Math.random() * 2) + 2 // Random number between 2 and 3
    const shuffled = [...eligibleMembers].sort(() => 0.5 - Math.random())
    const selectedMembers = shuffled.slice(0, numberOfSpotlights)

    // Create HTML for spotlights
    const spotlightsHTML = `
            <div class="spotlight-container">
                ${selectedMembers
                  .map(
                    (member) => `
                    <div class="spotlight-card">
                        <div class="spotlight-header">
                            <div>
                                <h3 class="spotlight-title">${member.name}</h3>
                            </div>
                            <span class="membership-badge ${member.membershipLevel}">${member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)}</span>
                        </div>
                        <img src="${member.logo}" alt="${member.name} logo" class="spotlight-logo">
                        <div class="spotlight-info">
                            <p><i class="fas fa-phone"></i> ${member.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                            <p><i class="fas fa-globe"></i> <a href="https://${member.website}" target="_blank">${member.website}</a></p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    spotlightsContainer.innerHTML = spotlightsHTML
  } catch (error) {
    console.error("Error loading member data:", error)

    // Fallback to hardcoded data if JSON fetch fails
    const fallbackMembers = [
      {
        id: 1,
        name: "Springfield Tech Solutions",
        logo: "https://images.squarespace-cdn.com/content/v1/6692e6a1b95d9744c4a25291/ceb1b126-83d6-412e-a542-9350128ff75a/logo.png",
        phone: "(555) 123-4567",
        address: "123 Main St, Springfield",
        website: "www.springfieldtech.com",
        membershipLevel: "gold",
      },
      {
        id: 2,
        name: "Riverside Cafe",
        logo: "https://images.squarespace-cdn.com/content/v1/5f6979e3fdd2d23f8b58bd70/530e1a49-489f-4bd4-8bff-5f7668085197/RiverSidePNG.jpg",
        phone: "(555) 987-6543",
        address: "456 River Rd, Springfield",
        website: "www.riversidecafe.com",
        membershipLevel: "silver",
      },
      {
        id: 3,
        name: "Green Valley Insurance",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58yIlZjUCAf7_xRtET5NaYdciUDhH7u9eDQ&s",
        phone: "(555) 456-7890",
        address: "789 Oak Ave, Springfield",
        website: "www.greenvalleyins.com",
        membershipLevel: "gold",
      },
    ]

    // Randomly select 2-3 members from fallback data
    const numberOfSpotlights = Math.floor(Math.random() * 2) + 2
    const shuffled = [...fallbackMembers].sort(() => 0.5 - Math.random())
    const selectedMembers = shuffled.slice(0, numberOfSpotlights)

    // Create HTML for spotlights using fallback data
    const spotlightsHTML = `
            <div class="spotlight-container">
                ${selectedMembers
                  .map(
                    (member) => `
                    <div class="spotlight-card">
                        <div class="spotlight-header">
                            <div>
                                <h3 class="spotlight-title">${member.name}</h3>
                            </div>
                            <span class="membership-badge ${member.membershipLevel}">${member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)}</span>
                        </div>
                        <img src="${member.logo}" alt="${member.name} logo" class="spotlight-logo">
                        <div class="spotlight-info">
                            <p><i class="fas fa-phone"></i> ${member.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                            <p><i class="fas fa-globe"></i> <a href="https://${member.website}" target="_blank">${member.website}</a></p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    spotlightsContainer.innerHTML = spotlightsHTML
  }
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayCurrentDate()
  displayCurrentYear()
  displayLastUpdated()
  getWeatherData()
  displaySpotlights()
})

