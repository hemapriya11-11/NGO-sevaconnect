const mongoose = require('mongoose');
const path = require('path');
const NGO = require('./models/NGO');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const HelpRequest = require('./models/HelpRequest');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedTamilNaduNGOs = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seva-connect-hub';
        await mongoose.connect(MONGODB_URI);
        console.log('--- SEVACONNECT TAMIL NADU EDITION SEEDER ---');

        console.log('Step 1: Clearing existing entities to ensure clean, high-quality data...');
        await NGO.deleteMany({});
        await Campaign.deleteMany({});
        await HelpRequest.deleteMany({});

        console.log('Step 2: Linking to System Administrator...');
        let systemAdmin = await User.findOne({ role: 'admin' });
        if (!systemAdmin) {
            systemAdmin = await User.create({
                name: 'System Administrator',
                email: 'sevaconnect11@gmail.com',
                password: 'Sevaconnect@11',
                role: 'admin',
                phone: '+91 99887 76655',
                isVerified: true
            });
        }

        const NGO_PROJECTS = [
            {
                ngoName: "Chennai Heritage & Arts Foundation",
                description: "The Chennai Heritage & Arts Foundation is dedicated to the preservation of Tamil Nadu's classical arts, including Bharatanatyam and Carnatic music. We provide scholarships to underprivileged students to train under masters, and we host community festivals to keep ancient folk traditions alive in the urban landscape of Chennai. Our foundation works with over 50 traditional artists to document and digitize rare compositions for future generations.",
                mission: "To bridge the gap between traditional Tamil heritage and the modern generation through education, performance, and digital preservation.",
                vision: "A vibrant Chennai where every child has the opportunity to learn and appreciate our 2,000-year-old cultural legacy.",
                location: "Chennai, Tamil Nadu",
                address: "22, Mylapore Fine Arts Lane, Near Kapaleeshwarar Temple, Chennai - 600004",
                email: "heritage@chennaiarts.org.in",
                phone: "+91 44 2495 1122",
                website: "https://www.chennaiheritage.org",
                category: "arts",
                registrationNumber: "TN/CHN/2015/ART001",
                yearEstablished: 2015,
                teamSize: 15,
                status: "approved",
                totalPeopleHelped: 450,
                totalCampaigns: 12,
                image: "/assets/tamilculture.jpeg",
                coverImage: "/assets/hero-image.jpg",
                areasOfOperation: ["Chennai", "Kanchipuram", "Thiruvallur"],
                workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
                services: ["Bharatanatyam Classes", "Carnatic Vocal Training", "Folk Art Preservation", "Cultural Scholarships"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Kovai Green Hands Initiative",
                description: "Kovai Green Hands is a grassroots environmental movement in Coimbatore focused on urban afforestation and water body restoration. We have successfully created 15 'Oxygen Zones' in industrial belts using the Miyawaki technique and we work with schools to establish student-led organic nurseries. Our objective is to offset the carbon footprint of Coimbatore's industrial growth through sustainable green infrastructure.",
                mission: "To transform the industrial landscape of Coimbatore into a lush, breathable, and water-surplus eco-system through community-led afforestation.",
                vision: "Coimbatore as India's greenest and most sustainable industrial city.",
                location: "Coimbatore, Tamil Nadu",
                address: "88, RS Puram West Side, Behind Lawley Road, Coimbatore - 641002",
                email: "green@kovaigreenhands.in",
                phone: "+91 422 245 8899",
                website: "https://www.kovaigreenhands.in",
                category: "environment",
                registrationNumber: "TN/CBE/2012/ENV456",
                yearEstablished: 2012,
                teamSize: 32,
                status: "approved",
                totalPeopleHelped: 15200,
                totalCampaigns: 24,
                image: "/assets/greenhands.webp",
                coverImage: "/assets/marine.jpg",
                areasOfOperation: ["Coimbatore", "Tiruppur", "Pollachi", "Nilgiris"],
                workingHours: "Mon - Fri: 8:30 AM - 5:30 PM",
                services: ["Urban Afforestation", "River Restoration", "Environmental Workshops", "Organic Sapling Distribution"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: false
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Madurai Vidya Education Trust",
                description: "Madurai Vidya Trust works in the rural outskirts of Madurai to ensure that no child drops out of school due to financial hardship. We provide holistic support including after-school tutoring, digital literacy, and professional career guidance to first-generation learners from farming communities. We emphasize STEM education and English proficiency to make our students competitive in the global job market.",
                mission: "Empowering rural Tamil youth through high-quality primary education, digital exposure, and career mentorship.",
                vision: "Eliminating the rural-urban educational divide in the Temple City region within a decade.",
                location: "Madurai, Tamil Nadu",
                address: "15, Alagar Koil Road, Subramaniapuram, Madurai - 625002",
                email: "contact@maduraividya.org",
                phone: "+91 452 233 4455",
                website: "https://www.maduraividya.org",
                category: "education",
                registrationNumber: "TN/MDU/2008/EDU220",
                yearEstablished: 2008,
                teamSize: 55,
                status: "approved",
                totalPeopleHelped: 3200,
                totalCampaigns: 18,
                image: "/assets/child.jpg",
                coverImage: "/assets/education3.jpg",
                areasOfOperation: ["Madurai", "Dindigul", "Sivaganga", "Theni"],
                workingHours: "Daily: 8:00 AM - 8:00 PM",
                services: ["Rural Tutoring", "Digital Skills Lab", "Scholarship Guidance", "Teacher Training"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Trichy Able Hands Rehab",
                description: "Based in Tiruchirappalli, Able Hands provides comprehensive rehabilitation services for children and adults with neurological and physical disabilities. We operate a specialized prosthetic fitment center and provide vocational training in electronics and computer science. Our goal is to foster a society where disability is seen as a different ability, not a limitation.",
                mission: "To ensure that physical disability is never a barrier to social dignity, education, or economic independence.",
                vision: "A fully accessible, barrier-free, and disability-friendly societal structure in Central Tamil Nadu.",
                location: "Tiruchirappalli, Tamil Nadu",
                address: "44, Chatiram Bus Stand Road, Thillai Nagar, Trichy - 620018",
                email: "support@trichyablehands.org",
                phone: "+91 431 241 5566",
                website: "https://www.trichyablehands.org",
                category: "disability",
                registrationNumber: "TN/TRY/2010/DIS778",
                yearEstablished: 2010,
                teamSize: 28,
                status: "approved",
                totalPeopleHelped: 2150,
                totalCampaigns: 15,
                image: "/assets/Support-to-differently-Abled-bnr.jpg",
                coverImage: "/assets/disability2.webp",
                areasOfOperation: ["Trichy", "Karur", "Ariyalur", "Pudukkottai"],
                workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
                services: ["Physiotherapy", "Prosthetic Fitment", "Speech Therapy", "Vocational Training"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: false,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Salem Rural Health Mission",
                description: "The Salem Rural Health Mission brings specialized medical diagnostics to the doorstep of tribal and rural populations in the Yercaud and Kolli Hills area. We run weekly mobile clinics and provide free maternal health checkups and nutritional supplements. Our team of doctors and paramedics is trained to handle emergencies in terrain where formal hospitals are far away.",
                mission: "To deliver high-quality, compassionate, and specialized healthcare to the last mile of rural Salem through mobile technology.",
                vision: "Achieving zero maternal and infant mortality rates in the hill regions of Central Tamil Nadu.",
                location: "Salem, Tamil Nadu",
                address: "55, Steel Plant Road, Junction Area, Salem - 636005",
                email: "health@salemmission.org",
                phone: "+91 427 233 1122",
                website: "https://www.salemhealthmission.org",
                category: "health",
                registrationNumber: "TN/SLM/2014/MED330",
                yearEstablished: 2014,
                teamSize: 40,
                status: "approved",
                totalPeopleHelped: 12800,
                totalCampaigns: 21,
                image: "/assets/health.webp",
                coverImage: "/assets/medical aid.avif",
                areasOfOperation: ["Salem", "Namakkal", "Erode", "Dharmapuri"],
                workingHours: "24/7 Emergency Line",
                services: ["Mobile Medical Camps", "Maternal Care", "Diagnostic Screening", "Patient Transportation"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Nellai Stree Shakti Foundation",
                description: "Operating in the Tirunelveli and Thoothukudi belt, Stree Shakti empowers women through self-help groups (SHGs) and vocational training in food processing and sustainable textiles. We assist local women in branding and marketing their handmade goods to retail chains, ensuring they receive the full value for their labor and creativity.",
                mission: "Transforming rural women into confident breadwinners, entrepreneurs, and community leaders through skill-based training.",
                vision: "Ensuring economic sovereignty and social security for the women of South Tamil Nadu.",
                location: "Tirunelveli, Tamil Nadu",
                address: "Block C, Vannarpettai Main Road, Tirunelveli - 627003",
                email: "nellaishakti@org.in",
                phone: "+91 462 250 1122",
                website: "https://www.nellaishakti.org",
                category: "women",
                registrationNumber: "TN/TNV/2016/WEM900",
                yearEstablished: 2016,
                teamSize: 22,
                status: "approved",
                totalPeopleHelped: 1850,
                totalCampaigns: 9,
                image: "/assets/women empowerment.jpg",
                coverImage: "/assets/Women-Empowerment-Banner-700x228.jpg",
                areasOfOperation: ["Tirunelveli", "Thoothukudi", "Kanyakumari", "Tenkasi"],
                workingHours: "Mon - Sat: 10:00 AM - 5:00 PM",
                services: ["SHG Formation", "Livelihood Training", "Legal Literacy", "Micro-loan Support"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: false
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Thanjavur Delta Farmers Union",
                description: "Located in the rice bowl of Tamil Nadu, our union supports small-holder farmers with climate-resilient organic farming techniques. We operate a seed bank for indigenous rice varieties and provide interest-free equipment rentals to help marginal farmers mechanize their operations without falling into debt traps. We also facilitate direct farm-to-table markets for organic produce.",
                mission: "Reviving indigenous agricultural practices while ensuring economic viability and debt-freedom for delta farmers.",
                vision: "A prosperous, chemical-free, and biodiversity-rich Thanjavur Delta.",
                location: "Thanjavur, Tamil Nadu",
                address: "12, Medical College Road, Opp. Collectorate, Thanjavur - 613007",
                email: "deltafarmers@tn.org",
                phone: "+91 4362 277445",
                website: "https://www.deltafarmers.org",
                category: "agriculture",
                registrationNumber: "TN/TNJ/2005/AGR112",
                yearEstablished: 2005,
                teamSize: 45,
                status: "approved",
                totalPeopleHelped: 8400,
                totalCampaigns: 30,
                image: "/assets/agriculture.jpeg",
                coverImage: "/assets/agriculture2.jpeg",
                areasOfOperation: ["Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai"],
                workingHours: "Daily: 6:00 AM - 6:00 PM",
                services: ["Organic Certification", "Indigenous Seed Bank", "Equipment Rental", "Direct Marketing"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            },
            {
                ngoName: "Besant Nagar Golden Age Care",
                description: "Our center in Chennai provides dignified residential care for senior citizens who lack family support. We focus on active aging through physical therapy, community gardening, and bridge programs where our residents interact with students. We believe that old age should be a phase of peace, dignity, and continued social connection.",
                mission: "To provide a loving, professional, and stimulating home environment where every senior citizen feels valued and independent.",
                vision: "A society where aging is celebrated as a phase of wisdom and mentorship.",
                location: "Chennai, Tamil Nadu",
                address: "Unit 3, 2nd Main Road, Besant Nagar, Chennai - 600090",
                email: "care@goldenagebesant.org",
                phone: "+91 44 2490 8877",
                website: "https://www.besantcare.org",
                category: "elderly",
                registrationNumber: "TN/CHN/2011/SNR554",
                yearEstablished: 2011,
                teamSize: 18,
                status: "approved",
                totalPeopleHelped: 150,
                totalCampaigns: 6,
                image: "/assets/eldery.webp",
                coverImage: "/assets/eldery2.webp",
                areasOfOperation: ["Chennai", "Chengalpattu"],
                workingHours: "24/7 Residential Care",
                services: ["Residential Housing", "Palliative Care", "Geriatric Therapy", "Intergenerational Programs"],
                documents: {
                    registrationCertificate: true,
                    panCard: true,
                    certificate80G: true,
                    certificate12A: true
                },
                ownerId: systemAdmin._id
            }
        ];

        console.log('Step 3: Seeding Tamil Nadu NGOs with FULL DETAILS...');
        const seededNGOs = await NGO.insertMany(NGO_PROJECTS);
        console.log(`Success! ${seededNGOs.length} high-fidelity NGO profiles seeded.`);

        console.log('Step 4: Creating Realistic Help Requests...');
        const REQUEST_TEMPLATES = [
            {
                title: "Scholarship for Advanced Bharatanatyam Training",
                desc: "My daughter is a gifted dancer but we cannot afford the advanced lessons under Kalakshetra teachers. Requesting a one-year scholarship support.",
                reqName: "Karthikeyan S",
                phone: "+91 94432 11002",
                status: "approved",
                ngoIdx: 0 // Arts
            },
            {
                title: "Need Hearing Aid for School Student",
                desc: "My 10-year-old son has 60% hearing loss. We need a modern Bone Anchored Hearing Aid (BAHA) as recommended by medical college doctors.",
                reqName: "Lakshmi Narayanan",
                phone: "+91 91234 55667",
                status: "under_review",
                ngoIdx: 3 // Disability
            },
            {
                title: "Seed Fund for Mushroom Cultivation SHG",
                desc: "Our group of 10 women in Tirunelveli rural area wants to start an oyster mushroom unit. We need initial funds for the darkroom setup and spawn bags.",
                reqName: "Meena Kumari",
                phone: "+91 70112 23344",
                status: "submitted",
                ngoIdx: 5 // Women
            },
            {
                title: "Dialysis Support for Daily Wage Worker",
                desc: "I am a mason from Omalur. I have been diagnosed with CKD and need dialysis twice a week. I cannot afford the ₹1200 per session cost at private centers.",
                reqName: "Muthuvel P",
                phone: "+91 90033 44556",
                status: "completed",
                ngoIdx: 4 // Health
            },
            {
                title: "Education Kit for Tribal Students in Yercaud",
                desc: "Requesting school bags, notebooks, and raincoats for 25 children in our tribal hamlet who walk 4km daily to reach the primary school.",
                reqName: "Velan T",
                phone: "+91 99887 71122",
                status: "approved",
                ngoIdx: 4 // Health (Mobile clinic reach)
            }
        ];

        let requestsToInsert = [];
        seededNGOs.forEach((ngo, idx) => {
            const statuses = ['submitted', 'under_review', 'approved', 'completed'];
            for(let i=0; i<4; i++) {
                requestsToInsert.push({
                    ngoId: ngo._id,
                    userId: systemAdmin._id,
                    requestDetails: { message: `Request Case ID #${idx}${i}: Official support request for localized community intervention in ${ngo.location.split(',')[0]}. Needs documentation verification.` },
                    status: statuses[i],
                    phone: `+91 90000 120${idx}${i}`,
                    email: `requester.${idx}.${i}@tnmail.in`,
                    internalNotes: i === 3 ? "Process successfully closed. Verification successful." : "Initial triage in progress."
                });
            }
        });
        
        REQUEST_TEMPLATES.forEach(t => {
            requestsToInsert.push({
                ngoId: seededNGOs[t.ngoIdx]._id,
                userId: systemAdmin._id,
                requestDetails: { message: t.desc },
                status: t.status,
                phone: t.phone,
                email: `${t.reqName.toLowerCase().replace(' ', '.')}@example.com`,
                internalNotes: "Verified via physical visit and local reference."
            });
        });

        await HelpRequest.insertMany(requestsToInsert);
        console.log(`Success! ${requestsToInsert.length} realistic Help Requests added.`);

        console.log('Step 5: Seeding Professional Campaigns...');
        const CAMPAIGNS = [
            {
                title: "Mylapore Margazhi Mahotsav 2026",
                description: "A community festival providing platforms for folk artists from across Tamil Nadu to perform in Chennai. Includes workshops for students.",
                location: "Chennai, TN",
                status: "active",
                date: new Date('2026-12-15'),
                image: "/assets/tamilculture.jpeg",
                ngoIdx: 0
            },
            {
                title: "Noyyal River Afforestation Drive",
                description: "Mass planting of 10,000 native tree saplings along the banks of Noyyal to prevent erosion and improve water quality in Coimbatore industrial belt.",
                location: "Coimbatore, TN",
                status: "active",
                date: new Date('2026-06-05'),
                image: "/assets/greenhands.webp",
                ngoIdx: 1
            },
            {
                title: "Meenakshi Rural Digital Lab",
                description: "Setting up a computer-aided learning center for students in rural Madurai villages to teach English and coding skills.",
                location: "Madurai, TN",
                status: "active",
                date: new Date('2026-11-20'),
                image: "/assets/education2.jpeg",
                ngoIdx: 2
            },
            {
                title: "Kolli Hills Tribal Health Camp",
                description: "Mobile medical team visiting 15 remote hamlets to provide vaccinations and prenatal care to tribal families.",
                location: "Namakkal, TN",
                status: "completed",
                date: new Date('2026-03-10'),
                image: "/assets/health.webp",
                ngoIdx: 4
            },
            {
                title: "Delta Traditional Rice Seed Swap",
                description: "Encouraging farmers to switch back to traditional varieties to improve soil health and resilience against climate change.",
                location: "Thanjavur, TN",
                status: "active",
                date: new Date('2026-08-15'),
                image: "/assets/agriculture2.jpeg",
                ngoIdx: 6
            }
        ];

        const campaignsToInsert = CAMPAIGNS.map(c => ({
            ...c,
            ngoId: seededNGOs[c.ngoIdx]._id
        }));
        await Campaign.insertMany(campaignsToInsert);
        console.log(`Success! ${campaignsToInsert.length} High-impact Campaigns seeded.`);

        console.log('--- FINAL DATA SYNC COMPLETE ---');
        console.log(`Result: ${seededNGOs.length} NGOs (Full Detail) | ${requestsToInsert.length} Requests | ${campaignsToInsert.length} Campaigns`);
        
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('CRITICAL ERROR during seed execution:', error);
        process.exit(1);
    }
};

seedTamilNaduNGOs();
