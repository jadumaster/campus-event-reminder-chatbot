const axios = require("axios");
const Event = require("../models/Event");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send a Telegram message
 * @param {number} chatId - Telegram chat ID
 * @param {string} message - Message text to send
 */
const sendTelegramMessage = async (chatId, message) => {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
        });

        console.log(`✅ Telegram message sent to ${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Telegram Error: ${error.message}`);
        throw error;
    }
};

/**
 * Send a Telegram message with inline buttons
 * @param {number} chatId - Telegram chat ID
 * @param {string} message - Message text
 * @param {Array} buttons - Array of button objects
 */
const sendTelegramMessageWithButtons = async (chatId, message, buttons) => {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        console.log(`✅ Telegram message with buttons sent to ${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Telegram Error: ${error.message}`);
        throw error;
    }
};

/**
 * Handle incoming Telegram webhook
 */
const handleTelegramWebhook = (req, res) => {
    const update = req.body;

    console.log("📨 Telegram webhook received:", JSON.stringify(update, null, 2));

    if (update.message) {
        const chatId = update.message.chat.id;
        const messageText = update.message.text;
        const userId = update.message.from.id;

        console.log(`💬 Telegram Message from ${userId}: ${messageText}`);

        // Process the message
        processTelegramMessage(chatId, messageText, userId);

        res.sendStatus(200);
    } else if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        const data = update.callback_query.data;

        console.log(`🔘 Telegram Button Press: ${data}`);

        processTelegramCallback(chatId, data);

        res.sendStatus(200);
    } else {
        console.log("⚠️ Webhook received but no message or callback found");
        res.sendStatus(200);
    }
};

/**
 * Process incoming Telegram message and send response
 */
const processTelegramMessage = async (chatId, messageText, userId) => {
    try {
        const lowerText = messageText.toLowerCase();

        let responseMessage = "";
        let buttons = null;

        if (lowerText.includes("add event") || lowerText.includes("save event")) {
            responseMessage = "📝 <b>Add Event</b>\n\nTo add an event, please use our web dashboard or send details in this format:\n\n<code>Event: Title on Date at Time</code>\n\n(Note: Parsing logic coming soon!)";
        } else if (lowerText.includes("show events") || lowerText.includes("my events")) {
            const events = await Event.find().sort({ date: 1 }).limit(5);

            if (events.length === 0) {
                responseMessage = "📅 <b>No upcoming events found.</b>";
            } else {
                responseMessage = "📅 <b>Upcoming Events:</b>\n\n";
                events.forEach((event, index) => {
                    responseMessage += `${index + 1}. <b>${event.title}</b>\n   🗓 ${event.date} at ${event.time}\n   📍 ${event.location}\n\n`;
                });
                responseMessage += "💡 <i>Use /setreminder [event_number] to get alerts!</i>";
            }
        } else if (lowerText.includes("delete event")) {
            // In a real app, this would be complex interactive logic. 
            // For now, let's keep it simple or guide to web.
            responseMessage = "🗑️ <b>Delete Event</b>\n\nPlease use the web dashboard to delete events: <a href='http://localhost:3000'>Open Dashboard</a>";
        } else if (lowerText.includes("remind") || lowerText.includes("reminder")) {
            responseMessage = "⏰ <b>Event Reminders</b>\n\nGet alerts before your events!\n\n💡 <i>Reply with the event number to set a reminder</i>\n\nExample: <code>reminder 1</code>";
        } else {
            responseMessage = "👋 Welcome to Campus Event Chatbot!\n\n<b>Available Commands:</b>\n• /start - Start bot\n• Add event - (Web/Format)\n• Show events - View upcoming\n• Help - Get help";
            buttons = [
                [{ text: "Add Event", callback_data: "add_event" }],
                [{ text: "Show Events", callback_data: "show_events" }],
                [{ text: "Set Reminder", callback_data: "set_reminder" }],
                [{ text: "Help", callback_data: "help" }]
            ];
        }

        if (buttons) {
            await sendTelegramMessageWithButtons(chatId, responseMessage, buttons);
        } else {
            await sendTelegramMessage(chatId, responseMessage);
        }
    } catch (error) {
        console.error("Error processing Telegram message:", error);
        await sendTelegramMessage(chatId, "❌ An error occurred while processing your request.");
    }
};

/**
 * Process Telegram button callbacks
 */
const processTelegramCallback = async (chatId, data) => {
    try {
        let responseMessage = "";

        switch (data) {
            case "add_event":
                responseMessage = "📝 Please add events via our dashboard or use format:\n<code>Event: Title on Date at Time</code>";
                break;
            case "show_events":
                const events = await Event.find().sort({ date: 1 }).limit(5);
                if (events.length === 0) {
                    responseMessage = "📅 <b>No upcoming events found.</b>";
                } else {
                    responseMessage = "📅 <b>Upcoming Events:</b>\n\n";
                    events.forEach((event, index) => {
                        responseMessage += `${index + 1}. <b>${event.title}</b>\n   🗓 ${event.date} at ${event.time}\n\n`;
                    });
                    responseMessage += "💡 <i>Message '/setreminder 1' to set a reminder!</i>";
                }
                break;
            case "set_reminder":
                responseMessage = "⏰ <b>Set Event Reminder</b>\n\nWhich event would you like a reminder for?\n\n<code>/setreminder 1</code>\n<code>/setreminder 2</code>\n\nYou'll get notified 30 minutes before the event!";
                break;
            case "help":
                responseMessage = "ℹ️ <b>How to use:</b>\n\n📌 <b>Adding Events:</b>\nUse Dashboard or Format: <code>Event: Title on Date at Time</code>\n\n📅 <b>Viewing Events:</b>\nMessage: <code>Show events</code>\n\n⏰ <b>Set Reminders:</b>\nMessage: <code>/setreminder 1</code>";
                break;
            default:
                responseMessage = "Sorry, I didn't understand that.";
        }

        await sendTelegramMessage(chatId, responseMessage);
    } catch (error) {
        console.error("Error processing Telegram callback:", error);
        await sendTelegramMessage(chatId, "❌ Error processing request.");
    }
};

/**
 * Set Telegram webhook
 */
const setTelegramWebhook = async (webhookUrl) => {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
            url: webhookUrl
        });

        console.log(`✅ Telegram webhook set to: ${webhookUrl}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error setting Telegram webhook: ${error.message}`);
        throw error;
    }
};

module.exports = {
    sendTelegramMessage,
    sendTelegramMessageWithButtons,
    handleTelegramWebhook,
    processTelegramMessage,
    processTelegramCallback,
    setTelegramWebhook
};
