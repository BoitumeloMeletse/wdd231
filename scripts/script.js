// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnMenuBtn && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseButtons = document.querySelectorAll('.course-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.textContent.trim();
            
            courseButtons.forEach(courseBtn => {
                if (filter === 'All') {
                    courseBtn.style.display = 'block';
                } else {
                    if (courseBtn.textContent.includes(filter)) {
                        courseBtn.style.display = 'block';
                    } else {
                        courseBtn.style.display = 'none';
                    }
                }
            });
        });
    });
});