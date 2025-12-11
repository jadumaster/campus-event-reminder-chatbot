const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const Event = require("./models/Event");
const { handleWhatsAppWebhook, verifyWhatsAppToken } = require("./config/whatsapp");
const { handleTelegramWebhook, setTelegramWebhook } = require("./config/telegram");
const { scheduleEventReminder, cancelEventReminder } = require("./config/reminders");
const User = require("./models/User");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

// ----------------------
// WEBHOOK SETUP
// ----------------------

// Set Telegram webhook when server starts
const setupTelegramWebhook = async () => {
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            await setTelegramWebhook(webhookUrl);
        } catch (error) {
            console.error("Failed to set Telegram webhook:", error.message);
        }
    }
};

setupTelegramWebhook();

// ----------------------
// ----------------------
// API ROUTES
// ----------------------

// ----------------------
// AUTH ROUTE
// ----------------------

// Register new user
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

        const newUser = await User.create({
            username,
            password: hashedPassword,
            isAdmin: username === "admin" // Auto-admin for "admin" user
        });

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        if (hashedPassword !== user.password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Forgot Password (Mock)
app.post("/api/forgot-password", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Mock Email Sending
        console.log(`📧 [MOCK EMAIL] Sending password reset link to user: ${username}`);
        console.log(`🔗 Link: http://localhost:5000/reset-password?token=mock_token_123`);

        res.json({ success: true, message: "Password reset link sent to your email (check server console)" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WhatsApp Integration Routes
app.post("/webhook/whatsapp", handleWhatsAppWebhook);
app.get("/webhook/whatsapp", verifyWhatsAppToken);

// Telegram Integration Routes
app.post("/webhook/telegram", handleTelegramWebhook);

// ----------------------
// EVENT ROUTES
// ----------------------

// Get all events
app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new event
app.post("/api/events", async (req, res) => {
    try {
        const { title, date, time, description, location, category, attendees } = req.body;

        if (!title || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, date, time"
            });
        }

        const newEvent = await Event.create({
            title,
            date,
            time,
            description: description || "",
            location: location || "Campus",
            category: category || "Other",
            attendees: attendees || 0
        });

        res.status(201).json({ success: true, message: "Event added!", event: newEvent });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get event by ID
app.get("/api/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete event by ID
app.delete("/api/events/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({ success: true, message: "Event deleted!", event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
    try {
        const { title, date, time, description, location, category, attendees } = req.body;

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                date,
                time,
                description,
                location,
                category,
                attendees,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({ success: true, message: "Event updated!", event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Search events by keyword
app.get("/api/search/:keyword", async (req, res) => {
    try {
        const { keyword } = req.params;
        const events = await Event.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } }
            ]
        });

        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get events by category
app.get("/api/events/category/:category", async (req, res) => {
    try {
        const events = await Event.find({ category: req.params.category }).sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get upcoming events (next 7 days)
app.get("/api/upcoming", async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const events = await Event.find({
            date: {
                $gte: today.toDateString(),
                $lte: nextWeek.toDateString()
            }
        }).sort({ date: 1 });

        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------
// REMINDER ROUTES
// ----------------------

// Schedule reminder for an event
app.post("/api/reminders/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const { chatId, minutesBefore } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Parse event date and time
        const { parseEventDateTime } = require("./config/reminders");
        const eventDateTime = parseEventDateTime(event.date, event.time);

        if (!eventDateTime) {
            return res.status(400).json({
                success: false,
                message: "Could not parse event date/time"
            });
        }

        // Schedule the reminder
        scheduleEventReminder(
            eventId,
            chatId,
            eventDateTime,
            event.title,
            minutesBefore || 30
        );

        res.json({
            success: true,
            message: `Reminder scheduled for ${event.title}`,
            event
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cancel reminder for an event
app.delete("/api/reminders/:eventId", (req, res) => {
    try {
        const { eventId } = req.params;
        const cancelled = cancelEventReminder(eventId);

        if (cancelled) {
            res.json({
                success: true,
                message: "Reminder cancelled successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No active reminder found for this event"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "Server is running!",
        timestamp: new Date(),
        database: "MongoDB"
    });
});

// Get Bot Configuration (Links)
app.get("/api/config", (req, res) => {
    res.json({
        success: true,
        telegramLink: process.env.TELEGRAM_BOT_LINK || "https://t.me/EVENT254_BOT",
        whatsappLink: process.env.WHATSAPP_BOT_LINK || "https://wa.me/1234567890"
    });
});

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Campus Event Chatbot Backend running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   GET    /api/events - Get all events`);
    console.log(`   POST   /api/events - Add new event`);
    console.log(`   GET    /api/events/:id - Get event by ID`);
    console.log(`   PUT    /api/events/:id - Update event`);
    console.log(`   DELETE /api/events/:id - Delete event`);
    console.log(`   GET    /api/search/:keyword - Search events`);
    console.log(`   GET    /api/events/category/:category - Get events by category`);
    console.log(`   GET    /api/upcoming - Get upcoming events (7 days)`);
    console.log(`   GET    /api/health - Health check`);
});