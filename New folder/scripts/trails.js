// JavaScript for the trails page

// DOM Elements
const advancedSearchForm = document.getElementById('advanced-search-form');
const trailResultsContainer = document.getElementById('trail-results-container');
const mapContainer = document.getElementById('map-container');
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

// Parse URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    return params;
}

// Load trails based on search parameters
function loadTrails() {
    if (!trailResultsContainer) return;
    
    const params = getUrlParams();
    
    // Populate form with URL parameters if they exist
    if (advancedSearchForm) {
        if (params.location) {
            document.getElementById('location-search').value = params.location;
        }
        
        if (params.difficulty) {
            document.getElementById('difficulty-filter').value = params.difficulty;
        }
        
        if (params.length) {
            document.getElementById('length-filter').value = params.length;
        }
        
        if (params.features) {
            document.getElementById('features-filter').value = params.features;
        }
    }
    
    // Filter trails based on parameters
    const filteredTrails = filterTrails(params);
    
    // Display trails
    if (filteredTrails.length === 0) {
        trailResultsContainer.innerHTML = '<p>No trails found matching your criteria. Try adjusting your search filters.</p>';
    } else {
        displayTrails(filteredTrails, trailResultsContainer);
        lazyLoadImages();
        
        // Update map placeholder
        if (mapContainer) {
            mapContainer.innerHTML = `<div class="map-placeholder">
                <p>Map showing ${filteredTrails.length} trails</p>
                <p><small>Interactive map would be displayed here in a production environment</small></p>
            </div>`;
        }
    }
}

// Handle advanced search form submission
if (advancedSearchForm) {
    advancedSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const location = document.getElementById('location-search').value;
        const difficulty = document.getElementById('difficulty-filter').value;
        const length = document.getElementById('length-filter').value;
        const features = document.getElementById('features-filter').value;
        
        // Build query string
        const params = new URLSearchParams();
        
        if (location) params.append('location', location);
        if (difficulty) params.append('difficulty', difficulty);
        if (length) params.append('length', length);
        if (features) params.append('features', features);
        
        // Update URL and reload trails
        window.history.pushState({}, '', `?${params.toString()}`);
        loadTrails();
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTrails();
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

// Filter trails based on search parameters
function filterTrails(params) {
    let filteredTrails = [...allTrails];
    
    if (params.location) {
        filteredTrails = filteredTrails.filter(
            (trail) =>
                trail.location.toLowerCase().includes(params.location.toLowerCase()) ||
                trail.name.toLowerCase().includes(params.location.toLowerCase())
        );
    }
    
    if (params.difficulty) {
        filteredTrails = filteredTrails.filter((trail) => trail.difficulty === params.difficulty);
    }
    
    if (params.length) {
        // Parse length range (e.g., "0-3", "3-5", "5-10", "10+")
        const lengthRange = params.length.split('-');
        const minLength = Number.parseFloat(lengthRange[0]);
        const maxLength = lengthRange.length > 1 ? Number.parseFloat(lengthRange[1]) : Number.POSITIVE_INFINITY;
        
        filteredTrails = filteredTrails.filter((trail) => trail.length >= minLength && trail.length <= maxLength);
    }
    
    if (params.features) {
        filteredTrails = filteredTrails.filter((trail) => trail.features.includes(params.features));
    }
    
    return filteredTrails;
}

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

// Mock data for trails
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
    },
    {
        id: 4,
        name: "Summit Ridge Trail",
        location: "Grand Teton National Park, WY",
        difficulty: "difficult",
        length: 8.6,
        elevationGain: 2800,
        description: "A challenging trail with significant elevation gain, but the views from the summit are worth the effort. Experienced hikers only.",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjBwZWFrfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        features: ["views", "wildlife", "forest"],
        rating: 4.8,
        reviewCount: 75,
        isFeatured: false
    },
    {
        id: 5,
        name: "Emerald Lake Trail",
        location: "Rocky Mountain National Park, CO",
        difficulty: "moderate",
        length: 3.6,
        elevationGain: 650,
        description: "A popular trail that passes by three beautiful alpine lakes. The trail can be crowded during peak season.",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZW1lcmFsZCUyMGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        features: ["lake", "views", "wildflowers"],
        rating: 4.6,
        reviewCount: 320,
        isFeatured: false
    },
    {
        id: 6,
        name: "Granite Peak Trail",
        location: "Absaroka-Beartooth Wilderness, MT",
        difficulty: "very-difficult",
        length: 12.5,
        elevationGain: 4800,
        description: "The highest peak in Montana. This trail requires technical climbing skills and is only suitable for experienced mountaineers.",
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBwZWFrfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        features: ["views", "wildlife", "snow"],
        rating: 4.9,
        reviewCount: 42,
        isFeatured: false
    }
];