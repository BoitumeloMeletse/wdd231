// Import modules
import { fetchTrails } from './modules/api.js';
import { displayTrails } from './modules/trails.js';
import { setupModal } from './modules/modal.js';
import { lazyLoadImages, debounce } from './modules/utils.js';

// DOM Elements
const searchForm = document.getElementById('advanced-search-form');
const trailResultsContainer = document.getElementById('trail-results-container');
const mapContainer = document.getElementById('map-container');
const menuButton = document.getElementById('menu-button');
const primaryNav = document.getElementById('primary-nav');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
currentYearSpan.textContent = new Date().getFullYear();

// Toggle mobile menu
menuButton.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
});

// Initialize modal functionality
setupModal();

// Parse URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        location: params.get('location') || '',
        difficulty: params.get('difficulty') || '',
        length: params.get('length') || '',
        features: params.get('features') || ''
    };
}

// Search for trails
async function searchTrails(params) {
    try {
        trailResultsContainer.innerHTML = '<p class="loading">Searching for trails...</p>';
        
        const trails = await fetchTrails('all', params);
        
        displayTrails(trails, trailResultsContainer);
        lazyLoadImages();
        
        // Update map (in a real application, this would show the trails on a map)
        updateMap(trails);
        
        // Store search in localStorage
        localStorage.setItem('lastAdvancedSearch', JSON.stringify(params));
    } catch (error) {
        console.error('Error searching trails:', error);
        trailResultsContainer.innerHTML = `<p class="error">Failed to search trails. Please try again later.</p>`;
    }
}

// Update map with trail locations
function updateMap(trails) {
    // In a real application, this would use a mapping API like Google Maps or Leaflet
    // For this example, we'll just show a placeholder
    
    if (trails.length === 0) {
        mapContainer.innerHTML = `<p class="map-placeholder">No trails found to display on map</p>`;
        return;
    }
    
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <p>Map showing ${trails.length} trails</p>
            <ul class="map-trail-list">
                ${trails.map(trail => `<li>${trail.name} - ${trail.location}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Handle search form submission
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const params = {
            location: document.getElementById('location-search').value,
            difficulty: document.getElementById('difficulty-filter').value,
            length: document.getElementById('length-filter').value,
            features: document.getElementById('features-filter').value
        };
        
        searchTrails(params);
    });
    
    // Populate form with URL parameters or last search
    const urlParams = getUrlParams();
    const lastSearch = JSON.parse(localStorage.getItem('lastAdvancedSearch') || '{}');
    
    document.getElementById('location-search').value = urlParams.location || lastSearch.location || '';
    document.getElementById('difficulty-filter').value = urlParams.difficulty || lastSearch.difficulty || '';
    document.getElementById('length-filter').value = urlParams.length || lastSearch.length || '';
    document.getElementById('features-filter').value = urlParams.features || lastSearch.features || '';
    
    // If URL has parameters, search automatically
    if (urlParams.location || urlParams.difficulty) {
        searchTrails(urlParams);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // If no search parameters, show some default trails
    const urlParams = getUrlParams();
    if (!urlParams.location && !urlParams.difficulty) {
        fetchTrails().then(trails => {
            displayTrails(trails, trailResultsContainer);
            lazyLoadImages();
            updateMap(trails);
        }).catch(error => {
            console.error('Error loading default trails:', error);
            trailResultsContainer.innerHTML = `<p class="error">Failed to load trails. Please try again later.</p>`;
        });
    }
});