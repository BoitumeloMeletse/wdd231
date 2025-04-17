// API module for fetching data

// Fetch trails data
export async function fetchTrails(type = 'all', params = {}) {
    try {
        // Fetch trails data from JSON file
        const response = await fetch('data/trails.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const allTrails = await response.json();
        
        // Filter trails based on type and params
        let filteredTrails = [...allTrails];
        
        if (type === 'featured') {
            filteredTrails = filteredTrails.filter(trail => trail.isFeatured);
        }
        
        if (params.difficulty) {
            filteredTrails = filteredTrails.filter(trail => trail.difficulty === params.difficulty);
        }
        
        if (params.location) {
            filteredTrails = filteredTrails.filter(trail => 
                trail.location.toLowerCase().includes(params.location.toLowerCase())
            );
        }
        
        if (params.features) {
            const features = Array.isArray(params.features) ? params.features : [params.features];
            filteredTrails = filteredTrails.filter(trail => 
                features.some(feature => trail.features.includes(feature))
            );
        }
        
        if (params.length) {
            // Parse length range (e.g., "0-3", "3-5", "5-10", "10+")
            const lengthRange = params.length.split('-');
            const minLength = parseFloat(lengthRange[0]);
            const maxLength = lengthRange.length > 1 ? parseFloat(lengthRange[1]) : Infinity;
            
            filteredTrails = filteredTrails.filter(trail => 
                trail.length >= minLength && trail.length <= maxLength
            );
        }
        
        return filteredTrails;
    } catch (error) {
        console.error('Error fetching trails:', error);
        // Fall back to mock data if JSON fetch fails
        return getMockTrails(type, params);
    }
}

// Fetch trail reports
export async function fetchReports() {
    try {
        // Fetch reports data from JSON file
        const response = await fetch('data/reports.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching reports:', error);
        // Fall back to mock data if JSON fetch fails
        return getMockReports();
    }
}

// Fetch community members
export async function fetchMembers(membershipLevel = 'all') {
    try {
        // Fetch members data from JSON file
        const response = await fetch('data/members.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const members = await response.json();
        
        // Filter by membership level if specified
        if (membershipLevel !== 'all') {
            return members.filter(member => member.membershipLevel === membershipLevel);
        }
        
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
        // Fall back to mock data if JSON fetch fails
        return getMockMembers(membershipLevel);
    }
}

// Fetch events
export async function fetchEvents() {
    try {
        // Fetch events data from JSON file
        const response = await fetch('data/events.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        // Fall back to mock data if JSON fetch fails
        return getMockEvents();
    }
}

// Mock data for trails
function getMockTrails(type, params) {
    const allTrails = [
        {
            id: 1,
            name: "Eagle Peak Trail",
            location: "Rocky Mountain National Park, CO",
            difficulty: "moderate",
            length: 5.8,
            elevationGain: 1200,
            description: "A beautiful trail with panoramic views of the Rocky Mountains. This moderate hike takes you through pine forests and alpine meadows.",
            imageUrl: "images/trail-eagle-peak.jpg",
            features: ["views", "wildflowers", "forest"],
            rating: 4.7,
            reviewCount: 128,
            isFeatured: true
        },
        {
            id: 2,
            name: "Blue Lake Loop",
            location: "Mount Baker Wilderness, WA",
            difficulty: "easy",
            length: 3.2,
            elevationGain: 580,
            description: "An easy loop trail around a pristine alpine lake with stunning reflections of surrounding peaks. Great for families and beginners.",
            imageUrl: "images/trail-blue-lake.jpg",
            features: ["lake", "views", "wildflowers"],
            rating: 4.5,
            reviewCount: 95,
            isFeatured: true
        },
        {
            id: 3,
            name: "Cascade Falls Trail",
            location: "Yosemite National Park, CA",
            difficulty: "easy",
            length: 2.4,
            elevationGain: 400,
            description: "A short hike to a beautiful waterfall. This trail is perfect for beginners and families with children.",
            imageUrl: "images/trail-cascade-falls.jpg",
            features: ["waterfall", "forest", "river"],
            rating: 4.3,
            reviewCount: 210,
            isFeatured: true
        }
    ];
    
    // Apply the same filtering logic as in fetchTrails
    let filteredTrails = [...allTrails];
    
    if (type === 'featured') {
        filteredTrails = filteredTrails.filter(trail => trail.isFeatured);
    }
    
    if (params.difficulty) {
        filteredTrails = filteredTrails.filter(trail => trail.difficulty === params.difficulty);
    }
    
    if (params.location) {
        filteredTrails = filteredTrails.filter(trail => 
            trail.location.toLowerCase().includes(params.location.toLowerCase())
        );
    }
    
    return filteredTrails;
}

// Mock data for reports
function getMockReports() {
    return [
        {
            id: 1,
            userName: "Sarah Johnson",
            userAvatar: "images/avatar-1.jpg",
            trailName: "Eagle Peak Trail",
            date: "2023-06-15T10:30:00",
            content: "Hiked this trail yesterday and it was beautiful! The wildflowers are in full bloom and the views from the summit are breathtaking. Trail is in good condition with a few muddy spots near the creek crossings.",
            imageUrl: "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
        },
        {
            id: 2,
            userName: "Mike Chen",
            userAvatar: "images/avatar-2.jpg",
            trailName: "Blue Lake Loop",
            date: "2023-06-12T14:45:00",
            content: "Perfect day hike for families. The lake is crystal clear and there were plenty of spots to stop for a picnic. We saw several deer and a fox on the trail. Highly recommend for beginners!",
            imageUrl: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png"
        },
        {
            id: 3,
            userName: "Emily Rodriguez",
            userAvatar: "images/avatar-3.jpg",
            trailName: "Summit Ridge Trail",
            date: "2023-06-10T08:15:00",
            content: "Warning: There's still snow on the upper portion of the trail. Microspikes and trekking poles are highly recommended. The final push to the summit is challenging but worth it for the panoramic views.",
            imageUrl: "https://images.icon-icons.com/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png"
        },
        {
            id: 4,
            userName: "David Wilson",
            userAvatar: "images/avatar-4.jpg",
            trailName: "Cascade Falls Trail",
            date: "2023-06-08T11:20:00",
            content: "The waterfall is flowing strong right now! The trail is a bit crowded on weekends, so I recommend going early in the morning or on a weekday if possible. Easy hike with a big payoff at the end.",
            imageUrl: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Clip-Art-Background.png"
          },
          {
            id: 5,
            userName: "Lisa Park",
            userAvatar: "images/avatar-5.jpg",
            trailName: "Emerald Lake Trail",
            date: "2023-06-05T09:15:00",
            content: "All three lakes are stunning right now. The trail between Dream Lake and Emerald Lake still has some snow patches, but they're easy to navigate. Saw lots of marmots and even a moose near the lake!",
            imageUrl: "https://i.pinimg.com/564x/54/8a/65/548a659c2b06a877516d3c998f5b0939.jpg"
          },
          {
            id: 6,
            userName: "James Thompson",
            userAvatar: "images/avatar-6.jpg",
            trailName: "Granite Peak Trail",
            date: "2023-06-02T07:30:00",
            content: "This is NOT a trail for beginners or the faint of heart. The last mile requires some scrambling and there's significant exposure in places. The views from the top are incredible, but be prepared and bring plenty of water.",
            imageUrl: "https://w7.pngwing.com/pngs/87/237/png-transparent-male-avatar-boy-face-man-user-flat-classy-users-icon.png"
          }
    ];
}

// Mock data for members
function getMockMembers(membershipLevel) {
    const allMembers = [
        {
            id: 1,
            name: "Mountain High Outfitters",
            logo: "https://media.licdn.com/dms/image/sync/v2/D4E27AQFi-zduCFcIfA/articleshare-shrink_800/articleshare-shrink_800/0/1719884407781?e=2147483647&v=beta&t=iBHNa63EFURmUMroHtELZLh5PJcoY3-CliwXckJWh5w",
            phone: "(555) 123-4567",
            address: "123 Alpine Way, Boulder, CO",
            website: "www.mountainhighoutfitters.com",
            membershipLevel: "gold",
            description: "Your one-stop shop for all hiking and outdoor equipment needs."
          },
          {
            id: 2,
            name: "Lowveld Trails",
            logo: "https://www.lowveldtrails.co.za/wp-content/uploads/2023/08/FGASA-Logo.png",
            phone: "(555) 987-6543",
            address: "456 Summit Rd, Seattle, WA",
            website: "www.lowveldtrails.co.za",
            membershipLevel: "gold",
            description: "Professional guides for mountain trails and wilderness adventures."
          },
          {
            id: 3,
            name: "Alpine Photography",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIdqbpLvD9ri4Y8xlPKie7Hy089Sd9oC5NSA&s",
            phone: "(555) 456-7890",
            address: "789 Vista Dr, Portland, OR",
            website: "www.alpinephotography.com",
            membershipLevel: "silver",
            description: "Capturing the beauty of mountain landscapes and trail adventures."
          },
          {
            id: 4,
            name: "Wilderness First Aid",
            logo: "https://www.mountaineers.org/locations-lodges/seattle-branch/committees/seattle-first-aid-committee/course-templates/in-person-wfa/wilderness-first-aid-wfa-inperson-2024/@@images/image",
            phone: "(555) 234-5678",
            address: "321 Safety Ln, Denver, CO",
            website: "www.wildernessfirstaid.org",
            membershipLevel: "gold",
            description: "Training and certification for outdoor emergency response."
          },
          {
            id: 5,
            name: "Mountain Cafe",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTinrtIN5FI3RFqHpP8ArZxIzpLAXeh1kpX6Q&s",
            phone: "(555) 876-5432",
            address: "567 Trailhead Ave, Aspen, CO",
            website: "www.mountaincafe.com",
            membershipLevel: "silver",
            description: "Fuel up before your hike with our hearty breakfasts and trail lunches."
          },
          {
            id: 6,
            name: "Peak Performance Fitness",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5cugPsnDGWK4HgUtx3Uqc2CaX-WC68roMBg&s",
            phone: "(555) 345-6789",
            address: "890 Elevation St, Salt Lake City, UT",
            website: "www.peakperformancefitness.com",
            membershipLevel: "silver",
            description: "Training programs designed specifically for hikers and mountain athletes."
          },
          {
            id: 7,
            name: "Trailside Lodge",
            logo: "https://img1.wsimg.com/isteam/ip/b3b7f8b1-0eeb-4d68-8c0c-27908a394156/TL%20Logo.png",
            phone: "(555) 654-3210",
            address: "432 Forest Rd, Jackson, WY",
            website: "www.trailsidelodge.com",
            membershipLevel: "gold",
            description: "Comfortable accommodations located near popular trailheads."
          },
          {
            id: 8,
            name: "Mountain Rescue Team",
            logo: "https://www.giscorps.org/wp-content/uploads/2019/02/Mra-Blue-Large-1024x1024.jpg?6bfec1&6bfec1",
            phone: "(555) 789-0123",
            address: "901 Emergency Way, Bozeman, MT",
            website: "www.mountainrescueteam.org",
            membershipLevel: "gold",
            description: "Volunteer organization dedicated to mountain safety and rescue operations."
          }
    ];
    
    if (membershipLevel !== 'all') {
        return allMembers.filter(member => member.membershipLevel === membershipLevel);
    }
    
    return allMembers;
}

// Mock data for events
function getMockEvents() {
    return [
        {
            id: 1,
            title: "Weekend Warrior Hike: Eagle Peak",
            date: "2023-07-15T09:00:00",
            location: "Rocky Mountain National Park",
            description: "Join us for a group hike to Eagle Peak. This is a moderate difficulty hike suitable for regular hikers.",
            organizer: "Mountain Trail Explorers Club",
            maxParticipants: 15,
            currentParticipants: 8
          },
          {
            id: 2,
            title: "Sunrise Photography Hike",
            date: "2023-07-22T05:30:00",
            location: "Mount Rainier National Park",
            description: "Early morning hike to capture the sunrise from Summit Ridge. Bring your camera and tripod!",
            organizer: "Nature Photography Group",
            maxParticipants: 10,
            currentParticipants: 6
          },
          {
            id: 3,
            title: "Family-Friendly Nature Walk",
            date: "2023-07-29T10:00:00",
            location: "Blue Lake Trail",
            description: "Easy hike around Blue Lake with activities for kids. Learn about local plants and wildlife.",
            organizer: "Outdoor Families Association",
            maxParticipants: 20,
            currentParticipants: 12
          },
          {
            id: 4,
            title: "Trail Maintenance Volunteer Day",
            date: "2023-08-05T08:00:00",
            location: "Cascade Falls Trail",
            description: "Help maintain one of our most popular trails! Tools and training provided. Lunch included for all volunteers.",
            organizer: "Mountain Trail Explorers Club",
            maxParticipants: 25,
            currentParticipants: 10
          },
          {
            id: 5,
            title: "Full Moon Night Hike",
            date: "2023-08-12T20:00:00",
            location: "Emerald Lake Trail",
            description: "Experience the magic of the mountains under a full moon. Headlamps required for safety.",
            organizer: "Mountain Trail Explorers Club",
            maxParticipants: 12,
            currentParticipants: 5
          },
          {
            id: 6,
            title: "Alpine Wildflower Identification Workshop",
            date: "2023-08-19T09:30:00",
            location: "Wildflower Meadow Trail",
            description: "Learn to identify common alpine wildflowers with our expert botanist. Field guides recommended.",
            organizer: "Mountain Botany Society",
            maxParticipants: 15,
            currentParticipants: 7
          }
    ];
}