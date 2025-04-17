// Main JavaScript file for the homepage

// DOM Elements
const trailsContainer = document.getElementById('trails-container');
const weatherContainer = document.getElementById('weather-container');
const reportsContainer = document.getElementById('reports-container');
const searchForm = document.getElementById('search-form');
const newsletterForm = document.getElementById('newsletter-form');
const menuButton = document.getElementById('menu-button');
const primaryNav = document.getElementById('primary-nav');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Toggle mobile menu
if (menuButton && primaryNav) {
    menuButton.addEventListener('click', () => {
        primaryNav.classList.toggle('show');
    });
}

// Initialize modal functionality
setupModal();

// Load featured trails
async function loadFeaturedTrails() {
    if (!trailsContainer) return;

    try {
        const trails = await fetchTrails('featured');
        displayTrails(trails, trailsContainer);
        lazyLoadImages();
    } catch (error) {
        console.error('Error loading featured trails:', error);
        if (trailsContainer) {
            trailsContainer.innerHTML = `<p class="error">Failed to load trails. Please try again later.</p>`;
        }
    }
}

// Load weather data
async function loadWeatherData() {
    if (!weatherContainer) return;

    try {
        const weather = await fetchWeather();
        displayWeather(weather, weatherContainer);
    } catch (error) {
        console.error('Error loading weather data:', error);
        if (weatherContainer) {
            weatherContainer.innerHTML = `<p class="error">Failed to load weather data. Please try again later.</p>`;
        }
    }
}

// Load trail reports
async function loadTrailReports() {
    if (!reportsContainer) return;

    try {
        const reports = await fetchReports();
        displayReports(reports, reportsContainer);
        lazyLoadImages();
    } catch (error) {
        console.error('Error loading trail reports:', error);
        if (reportsContainer) {
            reportsContainer.innerHTML = `<p class="error">Failed to load trail reports. Please try again later.</p>`;
        }
    }
}

// Handle search form submission
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = document.getElementById('location-input').value;
        const difficulty = document.getElementById('difficulty-select').value;
        
        // Store search preferences in localStorage
        localStorage.setItem('lastSearchLocation', location);
        localStorage.setItem('lastSearchDifficulty', difficulty);
        
        // Redirect to trails page with search parameters
        window.location.href = `trails.html?location=${encodeURIComponent(location)}&difficulty=${encodeURIComponent(difficulty)}`;
    });
    
    // Populate form with last search if available
    const lastLocation = localStorage.getItem('lastSearchLocation');
    const lastDifficulty = localStorage.getItem('lastSearchDifficulty');
    
    if (lastLocation) {
        document.getElementById('location-input').value = lastLocation;
    }
    
    if (lastDifficulty) {
        document.getElementById('difficulty-select').value = lastDifficulty;
    }
}

// Handle newsletter form submission
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // In a real application, you would send this data to a server
        // For this example, we'll just show a success message
        
        // Store subscription in localStorage
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({ name, email, date: new Date().toISOString() });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        // Show success message
        newsletterForm.innerHTML = `<p class="success-message">Thanks for subscribing, ${name}! We've sent a confirmation email to ${email}.</p>`;
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedTrails();
    loadWeatherData();
    loadTrailReports();
});

// ==================== UTILITY FUNCTIONS ====================

// Lazy load images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
  
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.add('loaded');
                    observer.unobserve(image);
                }
            });
        });
  
        lazyImages.forEach((image) => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach((image) => {
            image.src = image.dataset.src;
            image.classList.add('loaded');
        });
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== MODAL FUNCTIONALITY ====================

function setupModal() {
    // Get modal elements
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
  
    // Get report modal elements if they exist
    const reportModal = document.getElementById('report-modal');
    const reportModalClose = document.getElementById('report-modal-close');
    const addReportBtn = document.getElementById('add-report-btn');
    const trailReportForm = document.getElementById('trail-report-form');
  
    // Close modal when clicking the close button
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalContainer.classList.remove('show');
        });
    }
  
    // Close modal when clicking outside the modal content
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('show');
            }
        });
    }
  
    // Setup report modal if it exists
    if (reportModal && reportModalClose) {
        reportModalClose.addEventListener('click', () => {
            reportModal.classList.remove('show');
        });
  
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                reportModal.classList.remove('show');
            }
        });
    }
  
    // Open report modal when clicking add report button
    if (addReportBtn && reportModal) {
        addReportBtn.addEventListener('click', () => {
            reportModal.classList.add('show');
        });
    }
  
    // Handle trail report form submission
    if (trailReportForm) {
        trailReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
  
            // Get form data
            const trailName = document.getElementById('trail-name').value;
            const dateHiked = document.getElementById('date-hiked').value;
            const trailConditions = document.getElementById('trail-conditions').value;
            const reportDescription = document.getElementById('report-description').value;
  
            // Create a unique ID for the report
            const reportId = 'user-' + Date.now();
  
            // Store report in localStorage
            const userReports = JSON.parse(localStorage.getItem('userTrailReports') || '[]');
  
            userReports.push({
                id: reportId,
                trailName,
                date: dateHiked,
                conditions: trailConditions,
                reportDescription
            });
  
            localStorage.setItem('userTrailReports', JSON.stringify(userReports));
  
            // Close modal and show success message
            reportModal.classList.remove('show');
  
            // Reload reports to show the new one
            window.location.reload();
        });
    }
  
    // Return functions to open modal with content
    return {
        openModal: (title, content) => {
            if (modalTitle) modalTitle.textContent = title;
            if (modalContent) modalContent.innerHTML = content;
            if (modalContainer) modalContainer.classList.add('show');
        },
        closeModal: () => {
            if (modalContainer) modalContainer.classList.remove('show');
        }
    };
}

// ==================== TRAILS FUNCTIONALITY ====================

// Display trails in the specified container
function displayTrails(trails, container) {
    if (!trails || !container) return;
  
    // Clear loading message
    container.innerHTML = '';
  
    if (trails.length === 0) {
        container.innerHTML = '<p>No trails found matching your criteria.</p>';
        return;
    }
  
    // Create trail cards
    trails.forEach((trail) => {
        const trailCard = document.createElement('div');
        trailCard.className = 'trail-card';
  
        // Format difficulty class
        const difficultyClass = `difficulty-${trail.difficulty.replace(' ', '-')}`;
  
        // Use template literals to build the card HTML
        trailCard.innerHTML = `
            <img src="${trail.imageUrl || '/placeholder.svg?height=200&width=400'}" alt="${trail.name}" class="trail-image lazy" data-src="${trail.imageUrl || '/placeholder.svg?height=200&width=400'}">
            <div class="trail-content">
                <h3 class="trail-title">${trail.name}</h3>
                <p class="trail-location">${trail.location}</p>
                <div class="trail-stats">
                    <span>${trail.length} miles</span>
                    <span>${trail.elevationGain} ft elevation gain</span>
                </div>
                <span class="trail-difficulty ${difficultyClass}">${capitalizeFirstLetter(trail.difficulty)}</span>
                <p class="trail-description">${truncateText(trail.description, 100)}</p>
                <button class="trail-button view-trail-btn" data-trail-id="${trail.id}">View Details</button>
            </div>
        `;
  
        // Add event listener to view details button
        const viewButton = trailCard.querySelector('.view-trail-btn');
        viewButton.addEventListener('click', () => {
            showTrailDetails(trail);
        });
  
        container.appendChild(trailCard);
    });
  
    // Add event listeners to view details buttons
    setupTrailDetailButtons();
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Show trail details in modal
function showTrailDetails(trail) {
    const modal = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
  
    if (!modal || !modalTitle || !modalContent) return;
  
    modalTitle.textContent = trail.name;
  
    // Format difficulty class
    const difficultyClass = `difficulty-${trail.difficulty.replace(' ', '-')}`;
  
    // Build modal content
    const content = `
        <div class="trail-detail">
            <img src="${trail.imageUrl || '/placeholder.svg?height=300&width=600'}" alt="${trail.name}" class="trail-detail-image">
            <div class="trail-detail-info">
                <p class="trail-location">${trail.location}</p>
                <div class="trail-stats">
                    <span><strong>Length:</strong> ${trail.length} miles</span>
                    <span><strong>Elevation Gain:</strong> ${trail.elevationGain} ft</span>
                    <span><strong>Difficulty:</strong> <span class="trail-difficulty ${difficultyClass}">${capitalizeFirstLetter(trail.difficulty)}</span></span>
                </div>
                <div class="trail-features">
                    <strong>Features:</strong>
                    <ul>
                        ${trail.features.map((feature) => `<li>${capitalizeFirstLetter(feature)}</li>`).join('')}
                    </ul>
                </div>
                <div class="trail-rating">
                    <strong>Rating:</strong> ${trail.rating}/5 (${trail.reviewCount} reviews)
                </div>
                <p class="trail-description">${trail.description}</p>
            </div>
        </div>
    `;
  
    modalContent.innerHTML = content;
    modal.classList.add('show');
}

// Setup trail detail buttons
function setupTrailDetailButtons() {
    const viewButtons = document.querySelectorAll('.view-trail-btn');
  
    viewButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const trailId = button.getAttribute('data-trail-id');
  
            try {
                // In a real app, you would fetch the specific trail
                // For this example, we'll use the button's parent card data
                const trailCard = button.closest('.trail-card');
                const trailName = trailCard.querySelector('.trail-title').textContent;
                const trailLocation = trailCard.querySelector('.trail-location').textContent;
                const trailDescription = trailCard.querySelector('.trail-description').textContent;
                const trailImage = trailCard.querySelector('.trail-image').src;
  
                // Create a trail object from the card data
                const trail = {
                    id: trailId,
                    name: trailName,
                    location: trailLocation,
                    description: trailDescription.endsWith('...')
                        ? trailDescription + ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.'
                        : trailDescription,
                    imageUrl: trailImage,
                    length: 5.8, // Default values since we don't have this in the card
                    elevationGain: 1200,
                    difficulty: 'moderate',
                    features: ['views', 'wildflowers', 'forest'],
                    rating: 4.7,
                    reviewCount: 128
                };
  
                showTrailDetails(trail);
            } catch (error) {
                console.error('Error showing trail details:', error);
            }
        });
    });
}

// ==================== REPORTS FUNCTIONALITY ====================

// Display reports in the specified container
function displayReports(reports, container) {
    if (!reports || !container) return;
  
    // Clear loading message
    container.innerHTML = '';
  
    if (reports.length === 0) {
        container.innerHTML = '<p>No trail reports available.</p>';
        return;
    }
  
    // Create report cards
    reports.forEach((report) => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
  
        // Format date
        const formattedDate = formatDate(report.date);
  
        // Use template literals to build the card HTML
        reportCard.innerHTML = `
            <div class="report-header">
                <img src="${report.userAvatar || '/placeholder.svg?height=50&width=50'}" alt="${report.userName}" class="report-user-avatar">
                <div class="report-user-info">
                    <h4>${report.userName}</h4>
                    <span class="report-date">${formattedDate}</span>
                </div>
            </div>
            <p class="report-trail-name">${report.trailName}</p>
            <p class="report-content">${report.content}</p>
            ${report.imageUrl ? `<img src="${report.imageUrl}" alt="Trail photo" class="report-image lazy" data-src="${report.imageUrl}">` : ''}
        `;
  
        container.appendChild(reportCard);
    });
}

// ==================== WEATHER FUNCTIONALITY ====================

// Fetch weather data
async function fetchWeather(location = 'default') {
    try {
        // For demo purposes, we'll use mock data
        return getMockWeather(location);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return getMockWeather(location);
    }
}

// Display weather data in the specified container
function displayWeather(weatherData, container) {
    if (!weatherData || !weatherData.current || !container) {
        if (container) container.innerHTML = '<p>No weather data available.</p>';
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
        <div class="current-weather weather-card">
            <div class="weather-icon">
                <i class="weather-icon-${weatherData.current.icon}"></i>
            </div>
            <div class="weather-details">
                <h3>${weatherData.current.location || 'Mountain Area'}</h3>
                <div class="temperature">${formatTemp(weatherData.current.temp)}°F</div>
                <div class="weather-description">${capitalizeWords(weatherData.current.description)}</div>
            </div>
        </div>
        
        <div class="forecast-container">
            ${weatherData.forecast.map(day => `
                <div class="forecast-day weather-card">
                    <div class="weather-icon">
                        <i class="weather-icon-${day.icon}"></i>
                    </div>
                    <div class="weather-details">
                        <h3>${day.day}</h3>
                        <div class="forecast-temp">${formatTemp(day.temp)}°F</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
  
    // Clear loading message
    container.innerHTML = weatherHTML;
  
    // Add weather icon classes
    addWeatherIconClasses();
}

// Add CSS classes for weather icons
function addWeatherIconClasses() {
    // Check if styles already exist
    if (document.getElementById('weather-icon-styles')) return;
  
    const style = document.createElement('style');
    style.id = 'weather-icon-styles';
    style.textContent = `
        .weather-icon-sun::before { content: '☀️'; font-size: 2rem; }
        .weather-icon-moon::before { content: '🌙'; font-size: 2rem; }
        .weather-icon-cloud-sun::before { content: '⛅'; font-size: 2rem; }
        .weather-icon-cloud-moon::before { content: '☁️'; font-size: 2rem; }
        .weather-icon-cloud::before { content: '☁️'; font-size: 2rem; }
        .weather-icon-cloud-rain::before { content: '🌧️'; font-size: 2rem; }
        .weather-icon-bolt::before { content: '⚡'; font-size: 2rem; }
        .weather-icon-snowflake::before { content: '❄️'; font-size: 2rem; }
    `;
    document.head.appendChild(style);
}

// Mock weather data
function getMockWeather(location) {
    const current = {
        temp: 68.5,
        description: 'partly cloudy',
        icon: 'cloud-sun',
        location: location === 'default' ? 'Mountain Area' : location
    };
  
    const forecast = [
        {
            day: 'Mon',
            temp: 72.3,
            icon: 'sun'
        },
        {
            day: 'Tue',
            temp: 65.8,
            icon: 'cloud'
        },
        {
            day: 'Wed',
            temp: 70.1,
            icon: 'cloud-sun'
        }
    ];
  
    return { current, forecast };
}

// ==================== API FUNCTIONALITY ====================

// Fetch trails data
async function fetchTrails(type = 'all', params = {}) {
    try {
        // For demo purposes, we'll use mock data
        return getMockTrails(type, params);
    } catch (error) {
        console.error('Error fetching trails:', error);
        return [];
    }
}

// Fetch trail reports
async function fetchReports() {
    try {
        // For demo purposes, we'll use mock data
        return getMockReports();
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
}

// Mock data for trails
function getMockTrails(type, params) {
    const allTrails = [
        {
            id: 1,
            name: "Eagle Peak Trail",
            location: "Rocky Mountain National Park, CO",
            difficulty: "moderate",
            length: 5.8,
            elevationGain: 1200,
            description: "A beautiful trail with panoramic views of the Rocky Mountains. This moderate hike takes you through pine forests and alpine meadows.",
            imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
            features: ["views", "wildflowers", "forest"],
            rating: 4.7,
            reviewCount: 128,
            isFeatured: true
        },
        {
            id: 2,
            name: "Blue Lake Loop",
            location: "Mount Baker Wilderness, WA",
            difficulty: "easy",
            length: 3.2,
            elevationGain: 580,
            description: "An easy loop trail around a pristine alpine lake with stunning reflections of surrounding peaks. Great for families and beginners.",
            imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjBsYWtlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            features: ["lake", "views", "wildflowers"],
            rating: 4.5,
            reviewCount: 95,
            isFeatured: true
        },
        {
            id: 3,
            name: "Cascade Falls Trail",
            location: "Yosemite National Park, CA",
            difficulty: "easy",
            length: 2.4,
            elevationGain: 400,
            description: "A short hike to a beautiful waterfall. This trail is perfect for beginners and families with children.",
            imageUrl: "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXJmYWxsJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
            features: ["waterfall", "forest", "river"],
            rating: 4.3,
            reviewCount: 210,
            isFeatured: true
        }
    ];
    
    // Apply filtering logic
    let filteredTrails = [...allTrails];
    
    if (type === 'featured') {
        filteredTrails = filteredTrails.filter(trail => trail.isFeatured);
    }
    
    if (params.difficulty) {
        filteredTrails = filteredTrails.filter(trail => trail.difficulty === params.difficulty);
    }
    
    if (params.location) {
        filteredTrails = filteredTrails.filter(trail => 
            trail.location.toLowerCase().includes(params.location.toLowerCase()) ||
            trail.name.toLowerCase().includes(params.location.toLowerCase())
        );
    }
    
    return filteredTrails;
}

// Mock data for reports
function getMockReports() {
    return [
        {
            id: 1,
            userName: "Sarah Johnson",
            userAvatar: "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
            trailName: "Eagle Peak Trail",
            date: "2023-06-15T10:30:00",
            content: "Hiked this trail yesterday and it was beautiful! The wildflowers are in full bloom and the views from the summit are breathtaking. Trail is in good condition with a few muddy spots near the creek crossings."
        },
        {
            id: 2,
            userName: "Mike Chen",
            userAvatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png",
            trailName: "Blue Lake Loop",
            date: "2023-06-12T14:45:00",
            content: "Perfect day hike for families. The lake is crystal clear and there were plenty of spots to stop for a picnic. We saw several deer and a fox on the trail. Highly recommend for beginners!"
        },
        {
            id: 3,
            userName: "Emily Rodriguez",
            userAvatar: "https://images.icon-icons.com/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
            trailName: "Summit Ridge Trail",
            date: "2023-06-10T08:15:00",
            content: "Warning: There's still snow on the upper portion of the trail. Microspikes and trekking poles are highly recommended. The final push to the summit is challenging but worth it for the panoramic views."
        },
        {
            id: 3,
            userName: "Emily Rodriguez",
            userAvatar: "https://images.icon-icons.com/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
            trailName: "Summit Ridge Trail",
            date: "2023-06-10T08:15:00",
            content: "Warning: There's still snow on the upper portion of the trail. Microspikes and trekking poles are highly recommended. The final push to the summit is challenging but worth it for the panoramic views.",
          },
          {
            id: 4,
            userName: "David Wilson",
            userAvatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png",
            trailName: "Cascade Falls Trail",
            date: "2023-06-08T11:20:00",
            content: "The waterfall is flowing strong right now! The trail is a bit crowded on weekends, so I recommend going early in the morning or on a weekday if possible. Easy hike with a big payoff at the end.",
            conditions: "good"
          },
          {
            id: 5,
            userName: "Lisa Park",
            userAvatar: "https://images.icon-icons.com/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
            trailName: "Emerald Lake Trail",
            date: "2023-06-05T09:15:00",
            content: "All three lakes are stunning right now. The trail between Dream Lake and Emerald Lake still has some snow patches, but they're easy to navigate. Saw lots of marmots and even a moose near the lake!",
            conditions: "good"
          },
          {
            id: 6,
            userName: "James Thompson",
            userAvatar: "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
            trailName: "Granite Peak Trail",
            date: "2023-06-02T07:30:00",
            content: "This is NOT a trail for beginners or the faint of heart. The last mile requires some scrambling and there's significant exposure in places. The views from the top are incredible, but be prepared and bring plenty of water.",
            conditions: "hazardous"
          }
    ];
}