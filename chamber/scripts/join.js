// Toggle navigation menu for mobile view
document.getElementById('hamburger-btn').addEventListener('click', function() {
  document.getElementById('primary-nav').classList.toggle('show');
});


// Set current timestamp when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set timestamp
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Add animation to membership cards
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
    
    // Modal functionality
    const viewBenefitsBtns = document.querySelectorAll('.view-benefits-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    const modalOverlay = document.getElementById('modalOverlay');
    
    viewBenefitsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = this.closest('.membership-card').dataset.level;
            const modal = document.getElementById(`${level}Modal`);
            
            if (modal) {
                modal.classList.add('show');
                modalOverlay.style.display = 'block';
            }
        });
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                modalOverlay.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            modalOverlay.style.display = 'none';
        }
    });
    
    // Form submission
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                businessName: document.getElementById('businessName').value,
                membershipLevel: document.querySelector('input[name="membershipLevel"]:checked').value,
                timestamp: document.getElementById('timestamp').value
            };
            
            // Store form data in localStorage
            localStorage.setItem('chamberFormData', JSON.stringify(formData));
            
            // Submit the form
            this.submit();
        });
    }
});