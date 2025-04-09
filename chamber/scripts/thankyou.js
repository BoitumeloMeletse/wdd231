document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Get form data from localStorage
    const formDataString = localStorage.getItem('chamberFormData');
    
    if (formDataString) {
        const formData = JSON.parse(formDataString);
        const detailsGrid = document.querySelector('.details-grid');
        
        if (detailsGrid) {
            // Display form data
            const membershipLevels = {
                np: "NP Membership",
                bronze: "Bronze Membership",
                silver: "Silver Membership",
                gold: "Gold Membership"
            };
            
            // Format date
            const formattedDate = new Date(formData.timestamp).toLocaleString();
            
            // Create details rows
            const details = [
                { label: "Name", value: `${formData.firstName} ${formData.lastName}` },
                { label: "Email", value: formData.email },
                { label: "Phone", value: formData.phone },
                { label: "Business Name", value: formData.businessName },
                { label: "Membership Level", value: membershipLevels[formData.membershipLevel] || formData.membershipLevel },
                { label: "Submission Date", value: formattedDate }
            ];
            
            // Add rows to the grid
            details.forEach(detail => {
                const row = document.createElement('div');
                row.className = 'details-row';
                
                const label = document.createElement('div');
                label.className = 'details-label';
                label.textContent = detail.label + ':';
                
                const value = document.createElement('div');
                value.className = 'details-value';
                value.textContent = detail.value;
                
                row.appendChild(label);
                row.appendChild(value);
                detailsGrid.appendChild(row);
            });
        }
    } else {
        // No form data found
        const applicationDetails = document.getElementById('applicationDetails');
        if (applicationDetails) {
            applicationDetails.innerHTML = `
                <h2>No submission data found</h2>
                <p>Please complete the membership application form.</p>
            `;
        }
    }
});