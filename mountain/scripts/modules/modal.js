// Modal module for handling modal dialogs

// Setup modal functionality
export function setupModal() {
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.getElementById('modal-close');
    
    if (!modalContainer || !modalClose) return;
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', () => {
        closeModal(modalContainer);
    });
    
    // Close modal when clicking outside the modal content
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal(modalContainer);
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
            closeModal(modalContainer);
        }
    });
    
    // Setup report modal if it exists
    setupReportModal();
}

// Close modal
function closeModal(modalContainer) {
    modalContainer.classList.remove('show');
}

// Setup report modal
function setupReportModal() {
    const reportModal = document.getElementById('report-modal');
    const addReportBtn = document.getElementById('add-report-btn');
    const reportModalClose = document.getElementById('report-modal-close');
    const trailReportForm = document.getElementById('trail-report-form');
    
    if (!reportModal || !addReportBtn || !reportModalClose || !trailReportForm) return;
    
    // Open modal when clicking the add report button
    addReportBtn.addEventListener('click', () => {
        reportModal.classList.add('show');
    });
    
    // Close modal when clicking the close button
    reportModalClose.addEventListener('click', () => {
        closeModal(reportModal);
    });
    
    // Close modal when clicking outside the modal content
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            closeModal(reportModal);
        }
    });
    
    // Handle form submission
    trailReportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const trailName = document.getElementById('trail-name').value;
        const dateHiked = document.getElementById('date-hiked').value;
        const trailConditions = document.getElementById('trail-conditions').value;
        const reportDescription = document.getElementById('report-description').value;
        
        // In a real application, you would send this data to a server
        // For this example, we'll store it in localStorage
        
        const reports = JSON.parse(localStorage.getItem('userTrailReports') || '[]');
        reports.push({
            id: Date.now(),
            trailName,
            dateHiked,
            trailConditions,
            reportDescription,
            date: new Date().toISOString()
        });
        localStorage.setItem('userTrailReports', JSON.stringify(reports));
        
        // Close modal and show success message
        closeModal(reportModal);
        alert('Your trail report has been submitted successfully!');
        
        // Reset form
        trailReportForm.reset();
    });
}