const courses = [
    { code: 'CSE 110', name: 'Introduction to Programming', credits: 3, completed: true },
    { code: 'WDD 130', name: 'Web Fundamentals', credits: 3, completed: true },
    { code: 'CSE 111', name: 'Programming with Functions', credits: 3, completed: false },
    { code: 'CSE 210', name: 'Programming with Classes', credits: 3, completed: false },
    { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 3, completed: false },
    { code: 'WDD 231', name: 'Advanced Web Development', credits: 3, completed: false }
];

function displayCourses(filter = 'all') {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    const filteredCourses = filter === 'all' ? courses : courses.filter(course => course.code.startsWith(filter.toUpperCase()));
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
            <p>Status: ${course.completed ? 'Completed' : 'Not Completed'}</p>
        `;
        courseList.appendChild(courseCard);
    });
}

document.getElementById('all').addEventListener('click', () => displayCourses('all'));
document.getElementById('cse').addEventListener('click', () => displayCourses('cse'));
document.getElementById('wdd').addEventListener('click', () => displayCourses('wdd'));

displayCourses();