const mongoose = require('mongoose');
const path = require('path');
const NGO = require('./models/NGO');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const HelpRequest = require('./models/HelpRequest');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedRealisticData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seva-connect-hub';
    await mongoose.connect(MONGODB_URI);
    console.log('--- SEVACONNECT SYSTEM SEEDER ---');

    console.log('Step 1: Cleaning existing data...');
    await NGO.deleteMany({});
    await Campaign.deleteMany({});
    await HelpRequest.deleteMany({});
    console.log('Database cleared for NGO entities.');

    console.log('Step 2: Identifying system users...');
    // Find or create an owner user
    let systemUser = await User.findOne({ email: 'sevaconnect11@gmail.com' });
    if (!systemUser) {
      systemUser = await User.create({
        name: 'SevaConnect Admin',
        email: 'sevaconnect11@gmail.com',
        password: 'Sevaconnect@11',
        role: 'admin',
        phone: '+91 99999 00000',
        isVerified: true
      });
      console.log('System User created.');
    }

    const NGO_DATA = [
      {
        ngoName: "Abhaya Health Initiative",
        description: "Abhaya Health Initiative (AHI) is a grassroot organization dedicated to bringing quality medical care to the most remote villages of West Bengal. Our mobile medical units are equipped with diagnostic tools and essential medicines, ensuring that geographical isolation does not mean medical neglect. We focus on primary healthcare, maternal wellness, and infectious disease control.",
        mission: "To eliminate health inequality in rural India through mobile healthcare solutions and local health worker training.",
        vision: "A future where every citizen, regardless of their location, has immediate access to basic life-saving medical care.",
        location: "Kolkata, West Bengal",
        address: "Block G, Salt Lake Sector V, Suite 302, Kolkata - 700091",
        email: "contact@abhayahealth.org.in",
        phone: "+91 33 2455 1122",
        website: "https://www.abhayahealth.org.in",
        category: "health",
        registrationNumber: "WB/2012/0054321",
        yearEstablished: 2012,
        teamSize: 45,
        status: "approved",
        totalPeopleHelped: 12500,
        totalCampaigns: 18,
        image: "/assets/health.webp",
        coverImage: "/assets/medical aid.avif",
        ownerId: systemUser._id
      },
      {
        ngoName: "Vidya Jyoti Foundation",
        description: "Vidya Jyoti Foundation believes that education is the only true equalizer. We work predominantly in the aspirational districts of Uttar Pradesh, providing digital classrooms and after-school support to first-generation learners. By bridge school-to-work gaps with vocational courses, we ensure that students are not just educated but employable.",
        mission: "Empowering children from marginalized communities through technology-driven, high-quality primary and secondary education.",
        vision: "Zero drop-out rates in secondary education across North Indian rural districts.",
        location: "Lucknow, Uttar Pradesh",
        address: "15, Gomti Nagar Extension, Lucknow - 226010",
        email: "info@vidyajyoti.org",
        phone: "+91 522 7788 4455",
        website: "https://www.vidyajyoti.org",
        category: "education",
        registrationNumber: "UP/2008/7865431",
        yearEstablished: 2008,
        teamSize: 120,
        status: "approved",
        totalPeopleHelped: 45000,
        totalCampaigns: 42,
        image: "/assets/child.jpg",
        coverImage: "/assets/education3.jpg",
        ownerId: systemUser._id
      },
      {
        ngoName: "Anna Seva Trust",
        description: "Anna Seva Trust is committed to achieving 'Zero Hunger' in industrial belts and slum pockets of Bangalore and Chennai. We operate community kitchens that provide nutritious, balanced meals to daily wage laborers, rickshaw pullers, and their families. During times of crisis, we function as a logicital hub for dry ration distribution.",
        mission: "To provide hunger relief and nutritional security to the urban poor through community-led feeding programs.",
        vision: "An India where hunger never prevents a child from learning or a worker from earning.",
        location: "Bangalore, Karnataka",
        address: "Plot 88, Electronic City Phase II, Bangalore - 560100",
        email: "seva@annatrust.com",
        phone: "+91 80 4433 9988",
        website: "https://www.annasevatrust.com",
        category: "food",
        registrationNumber: "KA/2015/ANNA990",
        yearEstablished: 2015,
        teamSize: 65,
        status: "approved",
        totalPeopleHelped: 550000,
        totalCampaigns: 24,
        image: "/assets/hero-image.jpg",
        coverImage: "/assets/agriculture.jpeg",
        ownerId: systemUser._id
      },
      {
        ngoName: "Stree Shakti Empowerment Hub",
        description: "Based in the heart of Mumbai's industrial suburbs, Stree Shakti empowers women from low-income backgrounds by providing them with specialized training in tailoring, beautician services, and digital marketing. We also provide financial literacy and micro-loan facilitation to help our graduates start their own small businesses.",
        mission: "Transforming women from home-makers to bread-winners through skill-based livelihoods and entrepreneurial support.",
        vision: "Economic independence and social dignity for every woman in urban India.",
        location: "Mumbai, Maharashtra",
        address: "Unit 12, Dharavi Business Center, Sion West, Mumbai - 400022",
        email: "connect@streeshakti.org.in",
        phone: "+91 22 2456 7890",
        website: "https://www.streeshakti.org.in",
        category: "women",
        registrationNumber: "MH/2010/8899123",
        yearEstablished: 2010,
        teamSize: 30,
        status: "approved",
        totalPeopleHelped: 8400,
        totalCampaigns: 15,
        image: "/assets/women empowerment.jpg",
        coverImage: "/assets/Women-Empowerment-Banner-700x228.jpg",
        ownerId: systemUser._id
      },
      {
        ngoName: "Harit Bharat Mission",
        description: "Harit Bharat Mission is an environmental NGO working to reclaim urban spaces from pollution. We specialize in the 'Miyawaki' method of urban afforestation, creating dense green pockets in the concrete jungle of Delhi NCR. We also run community zero-waste programs in high-rise apartments and educational workshops in schools.",
        mission: "Restoring the urban ecological balance through community-led planting and waste management.",
        vision: "Greener, cleaner, and more breathable Indian cities for future generations.",
        location: "New Delhi, Delhi",
        address: "Green Park Extension, House 5b, New Delhi - 110016",
        email: "hello@haritbharat.in",
        phone: "+91 11 2344 5566",
        website: "https://www.haritbharat.in",
        category: "environment",
        registrationNumber: "DL/2018/EVR007",
        yearEstablished: 2018,
        teamSize: 25,
        status: "approved",
        totalPeopleHelped: 120000,
        totalCampaigns: 12,
        image: "/assets/greenhands.webp",
        coverImage: "/assets/marine.jpg",
        ownerId: systemUser._id
      },
      {
        ngoName: "Sahaya Disability & Rehab",
        description: "Sahaya provides comprehensive support for people with physical and intellectual disabilities. From physiotherapy and speech therapy to providing high-quality prosthetic limbs, we work to ensure that every individual can lead a life of independence and contribution. We also advocate for accessible public infrastructure in South India.",
        mission: "Enabling people with disabilities to achieve their full potential through rehabilitation, tech-aid, and social advocacy.",
        vision: "A barrier-free India where inclusivity is a way of life.",
        location: "Chennai, Tamil Nadu",
        address: "44, Anna Salai, Guindy, Chennai - 600032",
        email: "support@sahayarehab.org",
        phone: "+91 44 2255 3344",
        website: "https://www.sahayarehab.org",
        category: "disability",
        registrationNumber: "TN/2005/DISABILITY101",
        yearEstablished: 2005,
        teamSize: 50,
        status: "approved",
        totalPeopleHelped: 15600,
        totalCampaigns: 30,
        image: "/assets/Support-to-differently-Abled-bnr.jpg",
        coverImage: "/assets/disability2.webp",
        ownerId: systemUser._id
      }
    ];

    console.log('Step 3: Seeding NGOs...');
    const seededNGOs = await NGO.insertMany(NGO_DATA);
    console.log(`Successfully seeded ${seededNGOs.length} NGOs.`);

    console.log('Step 4: Seeding Campaigns...');
    const CAMPAIGN_POOL = [
      {
        title: "Kharagpur Rural Health Camp",
        description: "A 3-day health camp focusing on eye checkups and general diagnosis for 500+ villagers in West Midnapore. Medicines for chronic conditions will be provided for free.",
        location: "Kharagpur, West Bengal",
        status: "active",
        date: new Date('2026-05-15'),
        image: "/assets/medical aid.avif",
        ngoIndex: 0
      },
      {
        title: "Uttar Pradesh Digital Literacy Drive",
        description: "Installing 10 smart classrooms in government schools of Rae Bareli. This involves setting up projectors, tablets, and training local teachers in digital pedagogy.",
        location: "Rae Bareli, UP",
        date: new Date('2026-04-01'),
        status: "active",
        image: "/assets/education2.jpeg",
        ngoIndex: 1
      },
      {
        title: "Mid-Day Meal Support: Whitefield Slums",
        description: "Expanding our kitchen capacity to serve 2000 more children daily in the Whitefield industrial area. This fundraiser covers grain procurement and logistics.",
        location: "Bangalore, Karnataka",
        date: new Date('2026-06-10'),
        status: "active",
        image: "/assets/agriculture2.jpeg",
        ngoIndex: 2
      },
      {
        title: "Dharavi Skill-Up 2025",
        description: "Graduation ceremony and job fair for 100 women trained in professional tailoring and embroidery. Connecting skilled workers with domestic export houses.",
        location: "Mumbai, MH",
        date: new Date('2026-03-20'),
        status: "completed",
        image: "/assets/Weaver3.jpg",
        ngoIndex: 3
      },
      {
        title: "Gurugram Micro-Forest Project",
        description: "Creating a 2-acre dense oxygen zone using the Miyawaki technique in the heart of Gurugram Sector 14. Involves planting 6,000 native tree saplings.",
        location: "Gurugram, Haryana",
        date: new Date('2026-07-01'),
        status: "active",
        image: "/assets/greenhands.webp",
        ngoIndex: 4
      },
      {
        title: "Chennai Prosthetics Distribution",
        description: "Custom fitting of lightweight prosthetic limbs for 50 beneficiaries from low-income communities. Includes 3 months of physical therapy follow-ups.",
        location: "Chennai, TN",
        date: new Date('2026-04-20'),
        status: "active",
        image: "/assets/disability2.webp",
        ngoIndex: 5
      }
    ];

    const campaignsToInsert = CAMPAIGN_POOL.map(c => ({
      ...c,
      ngoId: seededNGOs[c.ngoIndex]._id
    }));
    await Campaign.insertMany(campaignsToInsert);
    console.log(`Seeded ${campaignsToInsert.length} Campaigns.`);

    console.log('Step 5: Seeding Help Requests...');
    const REQUEST_TEMPLATES = [
      {
        title: "Emergency Surgery for Heart Condition",
        desc: "My 4-year-old son has a congenital heart defect and needs a valve replacement surgery immediately. We are unable to afford the hospital deposit of ₹2,00,000.",
        reqName: "Rakesh Mandal",
        phone: "+91 91223 34455",
        status: "under_review",
        ngoIndex: 0 // Health
      },
      {
        title: "Higher Education Scholarship",
        desc: "I have topped my Class 12 board exams but my father lost his job. I need funds to pay my first-year engineering college fees to avoid seat cancellation.",
        reqName: "Priya Sharma",
        phone: "+91 88776 55432",
        status: "approved",
        ngoIndex: 1 // Education
      },
      {
        title: "Ration Support for Widow-Led Family",
        desc: "After my husband passed away, I am struggling to feed my three children. I need a dry ration kit for at least 3 months until I find a stable job.",
        reqName: "Saritha K",
        phone: "+91 70112 23344",
        status: "submitted",
        ngoIndex: 2 // Food
      },
      {
        title: "Entrepreneurial Kit for Tailoring",
        desc: "I have completed the woman empowerment training but I don't have a sewing machine to start working from home. Assistance to buy a machine would be life-changing.",
        reqName: "Fatima Bi",
        phone: "+91 99008 87766",
        status: "completed",
        ngoIndex: 3 // Women
      },
      {
        title: "Neighborhood Tree Nursery Setup",
        desc: "Our community wants to start a small tree nursery to plant saplings in our neighborhood park. We need guidance and initial equipment like spades and fertilizers.",
        reqName: "Anil Kapoor",
        phone: "+91 98110 09988",
        status: "submitted",
        ngoIndex: 4 // Environment
      },
      {
        title: "Need Specialized Wheelchair",
        desc: "My daughter has cerebral palsy and has outgrown her old wheelchair. A specialized high-back wheelchair is required for her to attend school comfortably.",
        reqName: "Meenakshi Iyer",
        phone: "+91 94441 12233",
        status: "under_review",
        ngoIndex: 5 // Disability
      },
      {
        title: "Medication for Chronic Kidney Ailment",
        desc: "I am a senior citizen on dialysis. My monthly medicine bill exceeds my pension. Requesting help with procurement of essential renal drugs.",
        reqName: "Joseph Fernandes",
        phone: "+91 98223 34455",
        status: "approved",
        ngoIndex: 0 // Health
      }
    ];

    const requestsToInsert = REQUEST_TEMPLATES.map(r => ({
      ngoId: seededNGOs[r.ngoIndex]._id,
      userId: systemUser._id, // All requests linked to system user for simplicity
      requestDetails: { message: r.desc },
      status: r.status,
      phone: r.phone,
      email: `${r.reqName.toLowerCase().replace(' ', '.')}@example.com`,
      internalNotes: "Verified initial documents via phone call. Patient family is in urgent need."
    }));

    // Add more variety to statuses and quantities
    for(let i=0; i<15; i++) {
        const randomNGOIndex = Math.floor(Math.random() * seededNGOs.length);
        const statuses = ['submitted', 'under_review', 'approved', 'completed'];
        requestsToInsert.push({
            ngoId: seededNGOs[randomNGOIndex]._id,
            userId: systemUser._id,
            requestDetails: { message: `Automated testing query #${i+100} regarding community support and localized intervention programs.` },
            status: statuses[i % 4],
            phone: `+91 90000 100${i+10}`,
            email: `requester${i}@test.com`,
            internalNotes: "Routine processing notes."
        });
    }

    await HelpRequest.insertMany(requestsToInsert);
    console.log(`Seeded ${requestsToInsert.length} Help Requests in various statuses.`);

    console.log('--- SEEDING COMPLETE ---');
    console.log('Summary:');
    console.log(`- NGOs: ${seededNGOs.length}`);
    console.log(`- Campaigns: ${campaignsToInsert.length}`);
    console.log(`- Requests: ${requestsToInsert.length}`);
    
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedRealisticData();
