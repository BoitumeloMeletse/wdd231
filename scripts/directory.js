// Toggle navigation menu for mobile view
document.getElementById("hamburger-btn").addEventListener("click", () => {
    document.getElementById("primary-nav").classList.toggle("show")
  })
  
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()
  
  // Set last modified date in footer
  document.getElementById("last-modified").textContent = document.lastModified
  
  // Directory functionality
  const gridBtn = document.getElementById("grid-btn")
  const listBtn = document.getElementById("list-btn")
  const directoryContainer = document.getElementById("directory-container")
  const membershipFilter = document.getElementById("membership-filter")
  const featuredFilter = document.getElementById("featured-filter")
  
  // Toggle between grid and list view
  gridBtn.addEventListener("click", () => {
    directoryContainer.className = "grid-view"
    gridBtn.classList.add("active")
    listBtn.classList.remove("active")
  
    // Save preference to localStorage
    localStorage.setItem("directoryView", "grid")
  })
  
  listBtn.addEventListener("click", () => {
    directoryContainer.className = "list-view"
    listBtn.classList.add("active")
    gridBtn.classList.remove("active")
  
    // Save preference to localStorage
    localStorage.setItem("directoryView", "list")
  })
  
  // Apply saved view preference if available
  document.addEventListener("DOMContentLoaded", () => {
    const savedView = localStorage.getItem("directoryView")
    if (savedView === "list") {
      directoryContainer.className = "list-view"
      listBtn.classList.add("active")
      gridBtn.classList.remove("active")
    }
  })
  
  // Store all members for filtering
  let allMembers = []
  
  // Fetch and display member data
  async function getMembers() {
    try {
      const response = await fetch("data/members.json")
      if (!response.ok) {
        throw new Error("Failed to fetch member data")
      }
      const data = await response.json()
      allMembers = data // Store all members for filtering
      displayMembers(data)
  
      // Add last updated timestamp to the data
      const now = new Date()
      const lastUpdated = document.createElement("p")
      lastUpdated.className = "last-updated"
      lastUpdated.textContent = `Directory data last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
      const introElement = document.querySelector(".directory-intro")
      if (introElement && introElement.nextElementSibling) {
        introElement.parentNode.insertBefore(lastUpdated, introElement.nextElementSibling)
      } else if (introElement) {
        introElement.after(lastUpdated)
      }
    } catch (error) {
      console.error("Error loading member data:", error)
      directoryContainer.innerHTML = `<div class="error">Error loading directory data. Please try again later.</div>`
    }
  }
  
  function displayMembers(members) {
    // Clear loading message
    directoryContainer.innerHTML = ""
  
    if (members.length === 0) {
      directoryContainer.innerHTML =
        '<div class="no-results">No businesses match your filter criteria. Please try different filters.</div>'
      return
    }
  
    // Create member cards
    members.forEach((member) => {
      const memberCard = document.createElement("div")
      memberCard.className = "member-card"
  
      // Get membership level text
      let levelText = "Member"
      if (member.membershipLevel === 2) {
        levelText = "Silver"
      } else if (member.membershipLevel === 3) {
        levelText = "Gold"
      }
  
      // Format join date
      const joinDate = new Date(member.joinDate)
      const formattedJoinDate = joinDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
  
      // Create social media icons
      let socialIcons = ""
      if (member.socialMedia) {
        if (member.socialMedia.facebook) {
          socialIcons += `<a href="https://facebook.com/${member.socialMedia.facebook}" class="social-icon" target="_blank" aria-label="${member.name} on Facebook"><i class="fab fa-facebook-f"></i></a>`
        }
        if (member.socialMedia.twitter) {
          socialIcons += `<a href="https://twitter.com/${member.socialMedia.twitter}" class="social-icon" target="_blank" aria-label="${member.name} on Twitter"><i class="fab fa-twitter"></i></a>`
        }
        if (member.socialMedia.instagram) {
          socialIcons += `<a href="https://instagram.com/${member.socialMedia.instagram}" class="social-icon" target="_blank" aria-label="${member.name} on Instagram"><i class="fab fa-instagram"></i></a>`
        }
        if (member.socialMedia.linkedin) {
          socialIcons += `<a href="https://linkedin.com/company/${member.socialMedia.linkedin}" class="social-icon" target="_blank" aria-label="${member.name} on LinkedIn"><i class="fab fa-linkedin-in"></i></a>`
        }
      }
  
      // Featured badge
      const featuredBadge = member.featured ? '<div class="featured-badge">Featured</div>' : ""
  
      // Create card HTML
      memberCard.innerHTML = `
              ${featuredBadge}
              <div class="member-img-container">
                  <img src="images/member-images/${member.image}" alt="${member.name} logo" class="member-img">
              </div>
              <div class="member-details">
                  <h3>${member.name}</h3>
                  <p class="address">${member.address}</p>
                  <p class="phone">${member.phone}</p>
                  <p class="description">${member.description}</p>
                  <p class="hours"><strong>Hours:</strong> ${member.hours}</p>
                  <a href="${member.website}" class="member-website" target="_blank">Visit Website</a>
                  <div class="member-level level-${member.membershipLevel}">${levelText}</div>
                  <div class="member-social">${socialIcons}</div>
                  <p class="member-join-date">Member since ${formattedJoinDate}</p>
              </div>
          `
  
      directoryContainer.appendChild(memberCard)
    })
  }
  
  // Filter members based on selected criteria
  function filterMembers() {
    const membershipValue = membershipFilter.value
    const featuredValue = featuredFilter.value
  
    let filteredMembers = [...allMembers]
  
    // Filter by membership level
    if (membershipValue !== "all") {
      const level = Number.parseInt(membershipValue)
      filteredMembers = filteredMembers.filter((member) => member.membershipLevel === level)
    }
  
    // Filter by featured status
    if (featuredValue === "featured") {
      filteredMembers = filteredMembers.filter((member) => member.featured)
    }
  
    // Display filtered members
    displayMembers(filteredMembers)
  }
  
  // Add event listeners for filters
  membershipFilter.addEventListener("change", filterMembers)
  featuredFilter.addEventListener("change", filterMembers)
  
  // Load members when page loads
  document.addEventListener("DOMContentLoaded", getMembers)
  
  