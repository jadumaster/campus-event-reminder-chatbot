const schedule = require("node-schedule");
const { sendTelegramMessage } = require("./telegram");
const Event = require("../models/Event");

// Store active reminders
const activeReminders = new Map();

/**
 * Schedule a reminder for an event
 * @param {string} eventId - Event ID
 * @param {string} chatId - Telegram chat ID
 * @param {Date} eventDateTime - Event date and time
 * @param {string} eventTitle - Event title
 * @param {number} minutesBefore - How many minutes before to remind (default: 30)
 */
const scheduleEventReminder = (eventId, chatId, eventDateTime, eventTitle, minutesBefore = 30) => {
    try {
        // Cancel existing reminder if any
        if (activeReminders.has(eventId)) {
            const existingJob = activeReminders.get(eventId);
            existingJob.cancel();
        }

        // Calculate reminder time
        const reminderTime = new Date(eventDateTime.getTime() - minutesBefore * 60000);

        // Don't schedule if time has already passed
        if (reminderTime < new Date()) {
            console.log(`⚠️ Reminder time already passed for event: ${eventTitle}`);
            return null;
        }

        // Schedule the reminder
        const job = schedule.scheduleJob(reminderTime, async () => {
            const reminderMessage = `⏰ <b>Event Reminder!</b>\n\n📌 <b>${eventTitle}</b>\n⏱️ Starting in ${minutesBefore} minutes!\n\nDon't be late! 😊`;
            
            try {
                await sendTelegramMessage(chatId, reminderMessage);
                console.log(`✅ Reminder sent for event: ${eventTitle}`);
            } catch (error) {
                console.error(`❌ Failed to send reminder for event ${eventTitle}:`, error.message);
            }

            // Remove from active reminders
            activeReminders.delete(eventId);
        });

        // Store the job
        activeReminders.set(eventId, job);

        console.log(`📅 Reminder scheduled for ${eventTitle} at ${reminderTime}`);
        return job;
    } catch (error) {
        console.error("Error scheduling reminder:", error);
        return null;
    }
};

/**
 * Cancel a scheduled reminder
 * @param {string} eventId - Event ID
 */
const cancelEventReminder = (eventId) => {
    try {
        if (activeReminders.has(eventId)) {
            const job = activeReminders.get(eventId);
            job.cancel();
            activeReminders.delete(eventId);
            console.log(`❌ Reminder cancelled for event ID: ${eventId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error cancelling reminder:", error);
        return false;
    }
};

/**
 * Get all active reminders
 */
const getActiveReminders = () => {
    return Array.from(activeReminders.keys());
};

/**
 * Schedule reminders for all upcoming events in the database
 * (Run this on server startup)
 */
const scheduleAllEventReminders = async (defaultChatId) => {
    try {
        const events = await Event.find();
        
        console.log(`📋 Scheduling reminders for ${events.length} events...`);

        events.forEach((event) => {
            // Parse event date and time
            try {
                const eventDateTime = parseEventDateTime(event.date, event.time);
                
                if (eventDateTime) {
                    scheduleEventReminder(
                        event._id.toString(),
                        defaultChatId,
                        eventDateTime,
                        event.title,
                        30 // 30 minutes before
                    );
                }
            } catch (error) {
                console.error(`Failed to schedule reminder for event ${event.title}:`, error.message);
            }
        });

        console.log(`✅ Scheduled reminders for all upcoming events`);
    } catch (error) {
        console.error("Error scheduling all reminders:", error);
    }
};

/**
 * Parse event date and time to create a Date object
 * Supports formats like "10 March", "10 March 2025", "March 10", etc.
 */
const parseEventDateTime = (dateStr, timeStr) => {
    try {
        // Parse time (e.g., "2:30pm", "14:30", "2pm")
        let hours = 0;
        let minutes = 0;

        const timeMatch = timeStr.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i);
        if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;

            if (timeMatch[3]) {
                const period = timeMatch[3].toLowerCase();
                if (period === "pm" && hours !== 12) hours += 12;
                if (period === "am" && hours === 12) hours = 0;
            }
        }

        // Parse date (e.g., "10 March", "March 10", "10 March 2025")
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let day = 0;
        let month = 0;
        let year = new Date().getFullYear();

        // Try to match various date formats
        const dateMatch = dateStr.match(/(\d{1,2})\s+(\w+)\s*(\d{4})?/i) || 
                          dateStr.match(/(\w+)\s+(\d{1,2})\s*(\d{4})?/i);

        if (dateMatch) {
            if (!isNaN(dateMatch[1])) {
                // Format: "10 March 2025"
                day = parseInt(dateMatch[1]);
                month = monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase());
            } else {
                // Format: "March 10 2025"
                month = monthNames.findIndex(m => m.toLowerCase() === dateMatch[1].toLowerCase());
                day = parseInt(dateMatch[2]);
            }

            if (dateMatch[3]) {
                year = parseInt(dateMatch[3]);
            }
        }

        if (day > 0 && month >= 0) {
            const eventDate = new Date(year, month, day, hours, minutes, 0);
            
            // Only schedule if event is in the future
            if (eventDate > new Date()) {
                return eventDate;
            }
        }

        return null;
    } catch (error) {
        console.error("Error parsing event date/time:", error);
        return null;
    }
};

module.exports = {
    scheduleEventReminder,
    cancelEventReminder,
    getActiveReminders,
    scheduleAllEventReminders,
    parseEventDateTime
};
