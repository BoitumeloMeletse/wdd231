document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYear');
    const lastModifiedParagraph = document.getElementById('lastModified');

    currentYearSpan.textContent = new Date().getFullYear();
    lastModifiedParagraph.textContent = `Last Modified: ${document.lastModified}`;
});