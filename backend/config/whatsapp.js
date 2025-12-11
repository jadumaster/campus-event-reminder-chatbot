const axios = require("axios");

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "https://graph.instagram.com/v18.0";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Send a WhatsApp message
 * @param {string} recipientPhoneNumber - Recipient's phone number with country code (e.g., "1234567890")
 * @param {string} message - Message text to send
 */
const sendWhatsAppMessage = async (recipientPhoneNumber, message) => {
    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: recipientPhoneNumber,
                type: "text",
                text: {
                    preview_url: false,
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(`✅ WhatsApp message sent to ${recipientPhoneNumber}`);
        return response.data;
    } catch (error) {
        console.error(`❌ WhatsApp Error: ${error.message}`);
        throw error;
    }
};

/**
 * Handle incoming WhatsApp webhook
 */
const handleWhatsAppWebhook = (req, res) => {
    const body = req.body;

    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const phoneNumberId =
                body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = body.entry[0].changes[0].value.messages[0].from;
            const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

            console.log(`📱 WhatsApp Message from ${from}: ${msg_body}`);

            // Process the message and send response
            processWhatsAppMessage(from, msg_body, phoneNumberId);

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
};

/**
 * Verify WhatsApp webhook token
 */
const verifyWhatsAppToken = (req, res) => {
    const verify_token = process.env.WHATSAPP_VERIFY_TOKEN || "your_verify_token";
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (token === verify_token) {
        res.send(challenge);
    } else {
        res.sendStatus(403);
    }
};

/**
 * Process incoming WhatsApp message and send response
 */
const Event = require("../models/Event");

// ... existing code ...

/**
 * Process incoming WhatsApp message and send response
 */
const processWhatsAppMessage = async (senderPhone, messageText, phoneNumberId) => {
    try {
        const lowerText = messageText.toLowerCase().trim();
        let responseMessage = "";

        if (lowerText.includes("show events") || lowerText.includes("list events")) {
            // Fetch events from database
            const events = await Event.find().sort({ date: 1 }).limit(5);

            if (events.length === 0) {
                responseMessage = "📅 No upcoming events found.";
            } else {
                responseMessage = "📅 *Upcoming Events:*\n\n";
                events.forEach((event, index) => {
                    responseMessage += `${index + 1}. *${event.title}*\n   🗓 ${event.date} at ${event.time}\n   📍 ${event.location}\n\n`;
                });
                responseMessage += "💡 _Type 'help' for more options_";
            }
        } else if (lowerText.includes("help")) {
            responseMessage = "👋 *Campus Event Chatbot Help*\n\nTry these commands:\n- *Show events*: List upcoming events\n- *Add event*: (Web only currently)\n- *Contact*: Get support";
        } else {
            // Default welcome message
            responseMessage = "👋 I'm here to help with campus events! Try sending:\n\n*Show events* - to see what's happening";
        }

        // Send response back
        await sendWhatsAppMessage(senderPhone, responseMessage);
    } catch (error) {
        console.error("Error processing WhatsApp message:", error);
        await sendWhatsAppMessage(senderPhone, "Sorry, I encountered an error processing your request.");
    }
};

module.exports = {
    sendWhatsAppMessage,
    handleWhatsAppWebhook,
    verifyWhatsAppToken,
    processWhatsAppMessage
};
