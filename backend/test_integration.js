const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

// Mock Axios
axios.post = async (url, data) => {
    // console.log(`[Mock Axios] POST to ${url}`);
    // console.log(`[Mock Axios] Data:`, JSON.stringify(data, null, 2));

    if (data.text && data.text.body) {
        console.log(`[Mock WhatsApp Output]: ${data.text.body}`);
    } else if (data.text) {
        console.log(`[Mock Telegram Output]: ${data.text}`);
    }

    return { data: {} };
};

const Event = require("./models/Event");
const connectDB = require("./config/database");
const { processWhatsAppMessage } = require("./config/whatsapp");
const { processTelegramMessage } = require("./config/telegram");

const runTest = async () => {
    try {
        await connectDB();

        // 1. Setup Test Data
        console.log("\n--- Setting up Test Data ---");
        await Event.deleteMany({ title: "INTEGRATION_TEST_EVENT" });
        await Event.create({
            title: "INTEGRATION_TEST_EVENT",
            date: "2025-01-01",
            time: "10:00 AM",
            location: "Test Lab",
            description: "A test event"
        });
        console.log("✅ Test Event Created");

        // 2. Test WhatsApp
        console.log("\n--- Testing WhatsApp Logic ---");
        await processWhatsAppMessage("123456789", "show events", "phone_id_1");

        // 3. Test Telegram
        console.log("\n--- Testing Telegram Logic ---");
        await processTelegramMessage(99999, "show events", 88888);

        // 4. Cleanup
        console.log("\n--- Cleanup ---");
        await Event.deleteMany({ title: "INTEGRATION_TEST_EVENT" });
        console.log("✅ Cleanup Complete");

        mongoose.connection.close();
    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
};

runTest();
