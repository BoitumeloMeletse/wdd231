// DOM Elements
const menuButton = document.getElementById("menu-button")
const navMenu = document.getElementById("nav-menu")
const currentDateElement = document.getElementById("current-date")
const currentYearElement = document.getElementById("current-year")
const lastUpdatedElement = document.getElementById("last-updated")
const directorycontainer = document.getElementById("directory-container")

// Toggle mobile menu
menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("open")
  navMenu.classList.toggle("show")
})

// Format and display current date
function displayCurrentDate() {
  const now = new Date()
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  currentDateElement.textContent = now.toLocaleDateString("en-US", options)
}

// Display current year for copyright
function displayCurrentYear() {
  const year = new Date().getFullYear()
  currentYearElement.textContent = year
}

// Display last updated date
function displayLastUpdated() {
  lastUpdatedElement.textContent = document.lastModified
}


// Display random spotlights from JSON data source
async function displayMember() {
  try {
    // Show loading state
    memberContainer.innerHTML = `
             <div id="member-container" class="grid-view">
            <!-- Member cards will be inserted here by JavaScript -->
            <div class="loading"> 
                <p>Loading Directory...</p>   
            </div>
        `

    // Fetch members data from JSON file
    const response = await fetch("members.json")

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const members = await response.json()

    // Filter for gold and silver members
    const eligibleMembers = members.filter(
      (member) => member.membershipLevel === "gold" || member.membershipLevel === "silver",
    )

    // Randomly select 2-3 members
    const numberOfSpotlights = Math.floor(Math.random() * 2) + 2 // Random number between 2 and 3
    const shuffled = [...eligibleMembers].sort(() => 0.5 - Math.random())
    const selectedMembers = shuffled.slice(0, numberOfSpotlights)

    // Create HTML for member
    const memberHTML = `
            <div class="member-container">
                ${selectedMembers
                  .map(
                    (member) => `
                    <div class="spotlight-card">
                        <div class="spotlight-header">
                            <div>
                                <h3 class="spotlight-title">${member.name}</h3>
                            </div>
                            <span class="membership-badge ${member.membershipLevel}">${member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)}</span>
                        </div>
                        <img src="${member.logo}" alt="${member.name} logo" class="spotlight-logo">
                        <div class="spotlight-info">
                            <p><i class="fas fa-phone"></i> ${member.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                            <p><i class="fas fa-globe"></i> <a href="https://${member.website}" target="_blank">${member.website}</a></p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    spotlightsContainer.innerHTML = spotlightsHTML
  } catch (error) {
    console.error("Error loading member data:", error)

    // Fallback to hardcoded data if JSON fetch fails
    const fallbackMembers = [
      {
        id: 1,
        name: "Springfield Tech Solutions",
        logo: "https://images.squarespace-cdn.com/content/v1/6692e6a1b95d9744c4a25291/ceb1b126-83d6-412e-a542-9350128ff75a/logo.png",
        phone: "(555) 123-4567",
        address: "123 Main St, Springfield",
        website: "www.springfieldtech.com",
        membershipLevel: "gold",
      },
      {
        id: 2,
        name: "Riverside Cafe",
        logo: "https://images.squarespace-cdn.com/content/v1/5f6979e3fdd2d23f8b58bd70/530e1a49-489f-4bd4-8bff-5f7668085197/RiverSidePNG.jpg",
        phone: "(555) 987-6543",
        address: "456 River Rd, Springfield",
        website: "www.riversidecafe.com",
        membershipLevel: "silver",
      },
      {
        id: 3,
        name: "Green Valley Insurance",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58yIlZjUCAf7_xRtET5NaYdciUDhH7u9eDQ&s",
        phone: "(555) 456-7890",
        address: "789 Oak Ave, Springfield",
        website: "www.greenvalleyins.com",
        membershipLevel: "gold",
      },
      {
        "id": 4,
        "name": "Springfield Community Bank",
        "logo": "https://is2-ssl.mzstatic.com/image/thumb/Purple123/v4/85/40/f6/8540f6d4-de61-4aa6-d221-50ffe2b6f6d7/source/512x512bb.jpg",
        "phone": "(555) 234-5678",
        "address": "321 Financial Way, Springfield",
        "website": "www.springfieldbank.com",
        "membershipLevel": "gold"
      },
      {
        "id": 5,
        "name": "Mountain View Realty",
        "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LwzsnTng7GM2ZXn0I-nJL5swefkDtUqUfw&s0",
        "phone": "(555) 876-5432",
        "address": "567 Summit Dr, Springfield",
        "website": "www.mountainviewrealty.com",
        "membershipLevel": "silver"
      }
    ]

    // Randomly select 2-3 members from fallback data
    const numberOfSpotlights = Math.floor(Math.random() * 2) + 2
    const shuffled = [...fallbackMembers].sort(() => 0.5 - Math.random())
    const selectedMembers = shuffled.slice(0, numberOfSpotlights)

    // Create HTML for spotlights using fallback data
    const spotlightsHTML = `
            <div class="spotlight-container">
                ${selectedMembers
                  .map(
                    (member) => `
                    <div class="spotlight-card">
                        <div class="spotlight-header">
                            <div>
                                <h3 class="spotlight-title">${member.name}</h3>
                            </div>
                            <span class="membership-badge ${member.membershipLevel}">${member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)}</span>
                        </div>
                        <img src="${member.logo}" alt="${member.name} logo" class="spotlight-logo">
                        <div class="spotlight-info">
                            <p><i class="fas fa-phone"></i> ${member.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                            <p><i class="fas fa-globe"></i> <a href="https://${member.website}" target="_blank">${member.website}</a></p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    spotlightsContainer.innerHTML = spotlightsHTML
  }
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayCurrentDate()
  displayCurrentYear()
  displayLastUpdated()
  getWeatherData()
  displaySpotlights()
})

