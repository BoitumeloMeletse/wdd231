document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Handle last visit message
    displayLastVisit();
    
    // Fetch and display places data
    fetchPlaces();
});

// Function to handle last visit message
function displayLastVisit() {
    const lastVisitElement = document.getElementById('lastVisit');
    
    // Get current timestamp
    const now = Date.now();
    
    // Get last visit timestamp from localStorage
    const lastVisit = localStorage.getItem('lastVisit');
    
    // Set message based on last visit
    if (!lastVisit) {
        // First visit
        lastVisitElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        // Calculate time difference in days
        const daysDifference = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            // Less than a day
            lastVisitElement.textContent = "Back so soon! Awesome!";
        } else {
            // More than a day
            const dayText = daysDifference === 1 ? "day" : "days";
            lastVisitElement.textContent = `You last visited ${daysDifference} ${dayText} ago.`;
        }
    }
    
    // Update last visit timestamp
    localStorage.setItem('lastVisit', now);
}

// Function to fetch places data from JSON
async function fetchPlaces() {
    try {
        const response = await fetch('data/places.json');
        if (!response.ok) {
            throw new Error('Failed to fetch places data');
        }
        
        const data = await response.json();
        displayPlaces(data.places);
    } catch (error) {
        console.error('Error fetching places:', error);
        document.getElementById('placesGrid').innerHTML = `
            <div class="error">
                <p>Sorry, we couldn't load the places of interest. Please try again later.</p>
            </div>
        `;
    }
}

// Function to display places in the grid
function displayPlaces(places) {
    const placesGrid = document.getElementById('placesGrid');
    const template = document.getElementById('place-card-template');
    
    // Clear loading message
    placesGrid.innerHTML = '';
    
    // Create and append place cards
    places.forEach(place => {
        const card = template.content.cloneNode(true);
        
        // Set card content
        card.querySelector('.place-title').textContent = place.name;
        card.querySelector('.place-image').src = place.image;
        card.querySelector('.place-image').alt = place.name;
        card.querySelector('.place-address').textContent = place.address;
        card.querySelector('.place-description').textContent = place.description;
        
        // Add event listener to learn more button
        card.querySelector('.learn-more-btn').addEventListener('click', function() {
            alert(`You clicked to learn more about ${place.name}. In a real application, this would take you to a detailed page.`);
        });
        
        // Append card to grid
        placesGrid.appendChild(card);
    });
}