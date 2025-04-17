// JavaScript for the community page

// DOM Elements
const communityReportsContainer = document.getElementById('community-reports');
const eventsContainer = document.getElementById('events-container');
const joinForm = document.getElementById('join-form');
const addReportBtn = document.getElementById('add-report-btn');
const reportModal = document.getElementById('report-modal');
const reportModalClose = document.getElementById('report-modal-close');
const trailReportForm = document.getElementById('trail-report-form');
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

// Open report modal when clicking add report button
if (addReportBtn && reportModal) {
    addReportBtn.addEventListener('click', () => {
        reportModal.classList.add('show');
    });
}

// Close report modal when clicking the close button
if (reportModalClose && reportModal) {
    reportModalClose.addEventListener('click', () => {
        reportModal.classList.remove('show');
    });
    
    // Close modal when clicking outside the modal content
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.classList.remove('show');
        }
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
        loadCommunityReports();
        
        // Show success message
        alert('Your trail report has been submitted successfully!');
    });
}

// Load community trail reports
async function loadCommunityReports() {
    if (!communityReportsContainer) return;
    
    try {
        const reports = await fetchReports();
        
        // Add user-submitted reports from localStorage
        const userReports = JSON.parse(localStorage.getItem('userTrailReports') || '[]');
        
        // Combine and sort by date (newest first)
        const allReports = [...reports];
        
        userReports.forEach(userReport => {
            allReports.push({
                id: userReport.id,
                userName: 'You',
                userAvatar: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
                trailName: userReport.trailName,
                date: userReport.date,
                content: userReport.reportDescription,
                imageUrl: ''
            });
        });
        
        // Sort by date (newest first)
        allReports.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        displayReports(allReports, communityReportsContainer);
        lazyLoadImages();
    } catch (error) {
        console.error('Error loading community reports:', error);
        if (communityReportsContainer) {
            communityReportsContainer.innerHTML = `<p class="error">Failed to load trail reports. Please try again later.</p>`;
        }
    }
}

// Load upcoming events
function loadUpcomingEvents() {
    if (!eventsContainer) return;
    
    // Mock data for upcoming events
    const events = [
        {
            id: 1,
            title: "Weekend Warrior Hike: Eagle Peak",
            date: "2023-07-15T09:00:00",
            location: "Rocky Mountain National Park",
            description: "Join us for a group hike to Eagle Peak. This is a moderate difficulty hike suitable for regular hikers.",
            organizer: "Mountain Trail Explorers Club"
        },
        {
            id: 2,
            title: "Sunrise Photography Hike",
            date: "2023-07-22T05:30:00",
            location: "Mount Rainier National Park",
            description: "Early morning hike to capture the sunrise from Summit Ridge. Bring your camera and tripod!",
            organizer: "Nature Photography Group"
        },
        {
            id: 3,
            title: "Family-Friendly Nature Walk",
            date: "2023-07-29T10:00:00",
            location: "Blue Lake Trail",
            description: "Easy hike around Blue Lake with activities for kids. Learn about local plants and wildlife.",
            organizer: "Outdoor Families Association"
        }
    ];
    
    // Clear loading message
    eventsContainer.innerHTML = '';
    
    // Create event cards
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        // Format date
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Use template literals to build the card HTML
        eventCard.innerHTML = `
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <p><strong>Date:</strong> ${formattedDate} at ${formattedTime}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Organizer:</strong> ${event.organizer}</p>
            </div>
            <p class="event-description">${event.description}</p>
            <button class="primary-button event-rsvp-btn" data-event-id="${event.id}">RSVP</button>
        `;
        
        // Add event listener to RSVP button
        const rsvpButton = eventCard.querySelector('.event-rsvp-btn');
        rsvpButton.addEventListener('click', () => {
            handleEventRSVP(event);
        });
        
        eventsContainer.appendChild(eventCard);
    });
}

// Handle event RSVP
function handleEventRSVP(event) {
    // Check if user is logged in (for this example, we'll check if they've joined the community)
    const communityMembers = JSON.parse(localStorage.getItem('communityMembers') || '[]');
    
    if (communityMembers.length === 0) {
        alert('Please join the community before RSVPing to events.');
        // Scroll to join form
        document.querySelector('.join-community').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Store RSVP in localStorage
    const rsvps = JSON.parse(localStorage.getItem('eventRSVPs') || '[]');
    
    // Check if already RSVPed
    const alreadyRSVPed = rsvps.some(rsvp => rsvp.eventId === event.id);
    
    if (alreadyRSVPed) {
        alert('You have already RSVPed to this event.');
        return;
    }
    
    // Add RSVP
    rsvps.push({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        rsvpDate: new Date().toISOString()
    });
    
    localStorage.setItem('eventRSVPs', JSON.stringify(rsvps));
    
    alert(`You have successfully RSVPed to "${event.title}". We'll send you a reminder email before the event.`);
}

// Handle join form submission
if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email-address').value;
        const experienceLevel = document.getElementById('experience-level').value;
        const favoriteTrails = document.getElementById('favorite-trails').value;
        const notifications = document.getElementById('notifications').checked;
        
        // Store in localStorage
        const communityMembers = JSON.parse(localStorage.getItem('communityMembers') || '[]');
        
        // Check if email already exists
        const emailExists = communityMembers.some(member => member.email === email);
        
        if (emailExists) {
            alert('This email is already registered. Please use a different email address.');
            return;
        }
        
        // Add new member
        communityMembers.push({
            fullName,
            email,
            experienceLevel,
            favoriteTrails,
            notifications,
            joinDate: new Date().toISOString()
        });
        
        localStorage.setItem('communityMembers', JSON.stringify(communityMembers));
        
        // Show success message
        joinForm.innerHTML = `
            <div class="success-message">
                <h3>Welcome to the Community, ${fullName}!</h3>
                <p>Thank you for joining Mountain Trail Explorers. You can now share trail reports and RSVP to events.</p>
                <p>We've sent a confirmation email to ${email} with more information.</p>
            </div>
        `;
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCommunityReports();
    loadUpcomingEvents();
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
        }
    ];
}