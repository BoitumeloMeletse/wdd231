// Trail reports module for fetching and displaying trail reports

// Fetch trail reports
export async function fetchReports() {
    try {
        // For demo purposes, we'll use mock data instead of a real API
        // In a real application, you would use fetch with an actual API
        
        // Simulate API request with a delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Return mock data
        return getMockReports();
    } catch (error) {
        console.error('Error fetching trail reports:', error);
        throw error;
    }
}

// Display trail reports in the specified container
export function displayReports(reports, container) {
    if (!reports || reports.length === 0) {
        container.innerHTML = '<p>No trail reports available.</p>';
        return;
    }
    
    // Clear loading message
    container.innerHTML = '';
    
    // Create report cards
    reports.forEach(report => {
        const reportCard = createReportCard(report);
        container.appendChild(reportCard);
    });
}

// Create a report card element
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    
    // Format date
    const reportDate = new Date(report.date);
    const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Use template literals to build the card HTML
    card.innerHTML = `
        <div class="report-header">
            <img src="${report.userAvatar}" alt="${report.userName}" class="report-user-avatar lazy" data-src="${report.userAvatar}">
            <div class="report-user-info">
                <h4>${report.userName}</h4>
                <span class="report-date">${formattedDate}</span>
            </div>
        </div>
        <div class="report-trail-name">${report.trailName}</div>
        <div class="report-content">
            <p>${report.content}</p>
            ${report.imageUrl ? `<img src="${report.imageUrl}" alt="Trail photo" class="report-image lazy" data-src="${report.imageUrl}">` : ''}
        </div>
    `;
    
    return card;
}

// Mock trail reports data
function getMockReports() {
    return [
        {
            id: 1,
            userName: "Sarah Johnson",
            userAvatar: "images/avatar-1.jpg",
            trailName: "Eagle Peak Trail",
            date: "2023-06-15T10:30:00",
            content: "Hiked this trail yesterday and it was beautiful! The wildflowers are in full bloom and the views from the summit are breathtaking. Trail is in good condition with a few muddy spots near the creek crossings.",
            imageUrl: "images/report-1.jpg"
        },
        {
            id: 2,
            userName: "Mike Chen",
            userAvatar: "images/avatar-2.jpg",
            trailName: "Blue Lake Loop",
            date: "2023-06-12T14:45:00",
            content: "Perfect day hike for families. The lake is crystal clear and there were plenty of spots to stop for a picnic. We saw several deer and a fox on the trail. Highly recommend for beginners!",
            imageUrl: "images/report-2.jpg"
        },
        {
            id: 3,
            userName: "Emily Rodriguez",
            userAvatar: "images/avatar-3.jpg",
            trailName: "Summit Ridge Trail",
            date: "2023-06-10T08:15:00",
            content: "Warning: There's still snow on the upper portion of the trail. Microspikes and trekking poles are highly recommended. The final push to the summit is challenging but worth it for the panoramic views.",
            imageUrl: ""
        }
    ];
}