const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

const events = [
    // UPCOMING
    {
        title: "Campus Gaming Tourney 🎮",
        date: "25 Dec 2025",
        time: "10:00 AM",
        location: "Student Center Hall",
        category: "Social",
        description: "Join the ultimate FIFA and Call of Duty tournament!",
        // Valid Gaming Image
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        attendees: 120
    },
    {
        title: "Tech Startup Summit 🚀",
        date: "30 Dec 2025",
        time: "9:00 AM",
        location: "Innovation Hub",
        category: "Workshop",
        description: "Meet successful founders.",
        // Valid Tech Image
        image: "https://images.unsplash.com/photo-1559136555-9303dff5a98c?auto=format&fit=crop&w=800&q=80",
        attendees: 200
    },
    // PAST
    {
        title: "Freshers Bash 2024 🎉",
        date: "10 Oct 2024",
        time: "6:00 PM",
        location: "Amphitheater",
        category: "Social",
        description: "The biggest party of the year to welcome new students!",
        // Valid Party Image
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        attendees: 800,
        reviews: [
            { user: "Sarah", comment: "It was lit! 🔥" },
            { user: "Mike", comment: "Best night ever." }
        ]
    },
    {
        title: "Hackathon 1.0 💻",
        date: "05 Nov 2024",
        time: "8:00 AM",
        location: "Library Lab",
        category: "Academic",
        description: "24-hour coding marathon.",
        // Valid Coding Image
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=800&q=80",
        attendees: 50,
        reviews: []
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        await Event.deleteMany({});
        console.log("🧹 Cleared existing events");

        await Event.insertMany(events);
        console.log("🌱 Database seeded with Past & Upcoming events!");

        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
};

seedDB();
