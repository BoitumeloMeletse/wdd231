const courses = [
    { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: false },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: false },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: false },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: false },
    { code: "WDD 131", name: "Introduction to Web Services", credits: 3, completed: false },
    { code: "WDD 231", name: "Advanced CSS", credits: 3, completed: false }
];

function displayCourses(filteredCourses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';

    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        if (course.completed) {
            courseCard.classList.add('completed');
        }
        courseCard.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
            <p>Status: ${course.completed ? 'Completed' : 'Not Completed'}</p>
        `;
        courseList.appendChild(courseCard);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            let filteredCourses;

            if (filter === 'all') {
                filteredCourses = courses;
            } else {
                filteredCourses = courses.filter(course => course.code.startsWith(filter));
            }

            displayCourses(filteredCourses);
        });
    });

    // Initial display of all courses
    displayCourses(courses);
});