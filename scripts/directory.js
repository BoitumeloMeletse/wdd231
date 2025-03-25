// Toggle navigation menu for mobile view
document.getElementById('hamburger-btn').addEventListener('click', function() {
  document.getElementById('primary-nav').classList.toggle('show');
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Set last modified date in footer
document.getElementById('last-modified').textContent = document.lastModified;

// Directory functionality
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const directoryContainer = document.getElementById('directory-container');

// Toggle between grid and list view
gridBtn.addEventListener('click', function() {
  directoryContainer.className = 'grid-view';
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});

listBtn.addEventListener('click', function() {
  directoryContainer.className = 'list-view';
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});

// Fetch and display member data
async function getMembers() {
  try {
      const response = await fetch('data/members.json');
      if (!response.ok) {
          throw new Error('Failed to fetch member data');
      }
      const data = await response.json();
      displayMembers(data);
  } catch (error) {
      console.error('Error loading member data:', error);
      directoryContainer.innerHTML = `<div class="error">Error loading directory data. Please try again later.</div>`;
  }
}

function displayMembers(members) {
  // Clear loading message
  directoryContainer.innerHTML = '';
  
  // Create member cards
  members.forEach(member => {
      const memberCard = document.createElement('div');
      memberCard.className = 'member-card';
      
      // Get membership level text
      let levelText = 'Member';
      if (member.membershipLevel === 2) {
          levelText = 'Silver';
      } else if (member.membershipLevel === 3) {
          levelText = 'Gold';
      }
      
      // Create card HTML
      memberCard.innerHTML = `
          <div class="member-img-container">
              <img src="${member.image}" alt="${member.name} logo" class="member-img">
          </div>
          <div class="member-details">
              <h3>${member.name}</h3>
              <p class="address">${member.address}</p>
              <p class="phone">${member.phone}</p>
              <a href="${member.website}" class="member-website" target="_blank">Visit Website</a>
              <div class="member-level level-${member.membershipLevel}">${levelText}</div>
          </div>
      `;
      
      directoryContainer.appendChild(memberCard);
  });
}

// Load members when page loads
document.addEventListener('DOMContentLoaded', getMembers);