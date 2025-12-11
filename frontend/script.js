// ----------------------
// DOM ELEMENTS
// ----------------------
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const voiceContainer = document.getElementById("voice-overlay");

// Auth Elements
const authUsernameInput = document.getElementById("auth-username");
const authPasswordInput = document.getElementById("auth-password");
const authBtn = document.getElementById("auth-btn");
const authSwitch = document.getElementById("auth-switch");
const authTitle = document.getElementById("auth-title");
const navLogin = document.getElementById("nav-login");
const navAdmin = document.getElementById("nav-admin");

// Forgot Password Elements
const forgotLink = document.getElementById("forgot-password-link");
const forgotBox = document.getElementById("forgot-box");
const authBox = document.querySelector(".auth-box"); // Select the first one (Login)
const backToLoginBtn = document.getElementById("back-to-login");
const forgotBtn = document.getElementById("forgot-btn");
const forgotUsernameInput = document.getElementById("forgot-username");

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let isRegistering = false;

// ----------------------
// CONFIGURATION
// ----------------------
// ----------------------
// CONFIGURATION
// ----------------------
// ----------------------
let TELEGRAM_BOT_LINK = "https://t.me/EVENT254_BOT"; // Default fallback
let WHATSAPP_BOT_LINK = "https://wa.me/1234567890"; // Default fallback

// Fetch config from backend
fetch("http://localhost:5000/api/config")
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            TELEGRAM_BOT_LINK = data.telegramLink;
            WHATSAPP_BOT_LINK = data.whatsappLink;
            console.log("Bot links loaded:", TELEGRAM_BOT_LINK, WHATSAPP_BOT_LINK);
        }
    })
    .catch(err => {
        console.error("Error loading config:", err);
        // Fallback defaults
        TELEGRAM_BOT_LINK = "https://t.me/EVENT254_BOT";
        WHATSAPP_BOT_LINK = "https://wa.me/1234567890";
    });

// ----------------------
// NAVIGATION & TABS
// ----------------------
const navItems = document.querySelectorAll(".nav-item");
const viewSections = document.querySelectorAll(".view-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        // 1. Update Active Nav
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        // 2. Show Target View
        const targetId = item.getAttribute("data-tab");
        viewSections.forEach(section => section.classList.remove("active"));

        const targetSection = document.getElementById(`${targetId}-view`);
        if (targetSection) {
            targetSection.classList.add("active");
        }

        // 3. Load Data if needed
        if (targetId === "live-events") loadLiveEvents();
        if (targetId === "past-events") loadPastEvents();
        if (targetId === "admin") loadAdminEvents();

        // Special Login/Logout Logic
        if (targetId === "login") {
            if (currentUser) {
                // Logout
                logout();
            }
        }
    });
});

checkAuthUI();

// ----------------------
// CHAT LOGIC
// ----------------------

// Event listener for send button
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Show suggestions
userInput.addEventListener("input", () => {
    showCommandSuggestions(userInput.value);
});

async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    userInput.value = "";

    // Clear suggestions
    const suggestionsDiv = document.getElementById("suggestions");
    if (suggestionsDiv) suggestionsDiv.innerHTML = "";

    const typingBubble = botTyping();

    setTimeout(async () => {
        typingBubble.remove();
        const reply = await processUserMessage(text);
        addMessage(reply, "bot");
    }, 700);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-msg`;

    // Convert newlines to breaks for formatting
    messageDiv.innerHTML = text.replace(/\n/g, "<br>");

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-msg typing";
    typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

// ----------------------
// EVENT INTELLIGENCE
// ----------------------

async function processUserMessage(text) {
    text = text.toLowerCase();

    // 0. GREETINGS
    const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"];
    if (greetings.some(word => text.includes(word))) {
        return "Hello there! 👋 I'm your Campus Event assistant. How can I help you today?";
    }

    // 1. ADD EVENT
    if (text.includes("add event") || text.includes("save event")) {
        const event = extractEvent(text);
        if (event) {
            saveEvent(event);
            return `Event saved 🎉\n\n📌 <b>${event.title}</b>\n📅 ${event.date}\n⏰ ${event.time}`;
        }
        return "Please provide the event in this format:\n\nAdd event: Meeting on 10 March at 2pm";
    }

    // 2. SHOW EVENTS
    if (text.includes("show events") || text.includes("list events")) {
        const events = await getEvents();
        if (events.length === 0) return "You have no saved events yet.";

        let reply = "📅 <b>Your Saved Events:</b>\n\n";
        events.forEach((ev, i) => {
            reply += `${i + 1}. ${ev.title} — ${ev.date} at ${ev.time}\n`;
        });
        return reply;
    }

    // 3. DELETE EVENT
    if (text.includes("delete event")) {
        const num = parseInt(text.replace(/\D/g, ""));
        const events = await getEvents();

        if (!num || num < 1 || num > events.length)
            return "Please specify a valid event number to delete.";

        const eventId = events[num - 1]._id || events[num - 1].id;

        try {
            await fetch(`http://localhost:5000/api/events/${eventId}`, { method: "DELETE" });
            return `Event ${num} has been deleted.`;
        } catch (e) {
            return "Error deleting event.";
        }
    }

    return "I'm here to help! Try:\n- Add event\n- Show events\n- Delete event";
}

function extractEvent(text) {
    const regex = /add event:? (.+?) on (.+?) at (.+)/i;
    const match = text.match(regex);
    if (!match) return null;
    return {
        title: capitalize(match[1]),
        date: capitalize(match[2]),
        time: match[3]
    };
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function showCommandSuggestions(input) {
    let suggestionsDiv = document.getElementById("suggestions");
    const commands = ["Add event", "Show events", "Delete event"];
    const matches = commands.filter(cmd => cmd.toLowerCase().includes(input.toLowerCase()));

    if (input.length > 0 && matches.length > 0) {
        suggestionsDiv.innerHTML = matches.map(cmd =>
            `<div class="suggestion" onclick="document.getElementById('user-input').value='${cmd}'; sendBtn.click();">${cmd}</div>`
        ).join("");
    } else {
        suggestionsDiv.innerHTML = "";
    }
}

// ----------------------
// BACKEND API
// ----------------------

function saveEvent(event) {
    fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
    }).catch(err => console.error(err));
}

function getEvents() {
    return fetch("http://localhost:5000/api/events")
        .then(res => res.json())
        .then(data => data.success ? data.events : [])
        .catch(() => []);
}

// ----------------------
// DASHBOARD VIEWS
// ----------------------

async function loadLiveEvents() {
    const list = document.getElementById("live-events-list");
    list.innerHTML = '<div class="loading">Loading...</div>';

    const events = await getEvents();
    list.innerHTML = "";

    if (events.length === 0) {
        list.innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    events.forEach(ev => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <h3>${ev.title}</h3>
            <p>📅 ${ev.date}</p>
            <p>⏰ ${ev.time}</p>
            <p>📍 ${ev.location}</p>
        `;
        list.appendChild(card);
    });
}

function loadPastEvents() {
    // For now, just a placeholder or could filter by date if logic existed
    const list = document.getElementById("past-events-list");
    list.innerHTML = "<p><i>Past events archive is currently empty.</i></p>";
}
// ----------------------
// AUTHENTICATION LOGIC
// ----------------------

authSwitch.addEventListener("click", () => {
    isRegistering = !isRegistering;
    authTitle.textContent = isRegistering ? "Register" : "Login";
    authBtn.textContent = isRegistering ? "Register" : "Login";
    authSwitch.innerHTML = isRegistering ? "Already have an account? <span>Login</span>" : "Don't have an account? <span>Register</span>";
});

authBtn.addEventListener("click", async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    const endpoint = isRegistering ? "/api/register" : "/api/login";
    try {
        const res = await fetch(`http://localhost:5000${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.success) {
            if (isRegistering) {
                alert("Registration successful! Please login.");
                authSwitch.click(); // Switch back to login
            } else {
                currentUser = data.user;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                alert(`Welcome, ${currentUser.username}!`);
                checkAuthUI();
                // Go to dashboard
                navItems[0].click();
            }
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Auth error");
    }
});

function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("Logged out successfully.");
    checkAuthUI();
    document.querySelector('[data-tab="login"]').click();
}

// Forgot Password Logic
forgotLink.addEventListener("click", () => {
    // Hide Login Box, Show Forgot Box
    // Since they are siblings in auth-container, and we selected querySelector(".auth-box") which gets the first one...
    // Let's be more specific with IDs or classes
    // But actually, we can just hide the parent of the input fields?
    // Let's use specific box toggling
    document.querySelector(".auth-box").style.display = "none";
    forgotBox.style.display = "block";
});

backToLoginBtn.addEventListener("click", () => {
    forgotBox.style.display = "none";
    document.querySelector(".auth-box").style.display = "block";
});

forgotBtn.addEventListener("click", async () => {
    const username = forgotUsernameInput.value.trim();
    if (!username) {
        alert("Please enter your username.");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            backToLoginBtn.click(); // Return to login
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Error sending request.");
    }
});

function checkAuthUI() {
    if (currentUser) {
        navLogin.innerHTML = '<span class="icon">🚪</span> Logout';
        // Show Admin tab if admin
        if (currentUser.isAdmin) {
            navAdmin.style.display = "flex";
        } else {
            navAdmin.style.display = "none";
        }
    } else {
        navLogin.innerHTML = '<span class="icon">🔑</span> Login';
        navAdmin.style.display = "none";
    }
}

// ----------------------
// ADMIN LOGIC
// ----------------------

async function loadAdminEvents() {
    if (!currentUser || !currentUser.isAdmin) {
        document.getElementById("admin-events-list").innerHTML = "<p>Access Denied.</p>";
        return;
    }

    const list = document.getElementById("admin-events-list");
    list.innerHTML = '<p>Loading events...</p>';
    const events = await getEvents();
    list.innerHTML = "";

    if (events.length === 0) list.innerHTML = "<p>No events found.</p>";

    events.forEach(ev => {
        const item = document.createElement("div");
        item.className = "admin-event-item";
        item.innerHTML = `
            <div>
                <strong>${ev.title}</strong> (${ev.date} @ ${ev.time})
            </div>
            <button class="delete-btn" onclick="deleteEvent('${ev._id}')">Delete</button>
        `;
        list.appendChild(item);
    });
}

function deleteEvent(id) {
    if (confirm("Are you sure you want to delete this event?")) {
        fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    loadAdminEvents(); // Refresh
                } else {
                    alert("Failed to delete");
                }
            });
    }
}

// ----------------------
// INTEGRATIONS
// ----------------------

function connectTelegram() {
    if (!TELEGRAM_BOT_LINK || TELEGRAM_BOT_LINK === "#") {
        alert("❌ Error: Telegram link not loaded. Is the backend running?");
        return;
    }
    window.open(TELEGRAM_BOT_LINK, "_blank");
}

function connectWhatsApp() {
    if (!WHATSAPP_BOT_LINK || WHATSAPP_BOT_LINK === "#") {
        alert("❌ Error: WhatsApp link not loaded. Is the backend running?");
        return;
    }
    window.open(WHATSAPP_BOT_LINK, "_blank");
}

// ----------------------
// VOICE ASSISTANT
// ----------------------

// Inject floating button dynamically if not in HTML
const voiceBtn = document.createElement("button");
voiceBtn.id = "voice-btn";
voiceBtn.innerHTML = "🎤";
voiceBtn.title = "Speak";
voiceContainer.appendChild(voiceBtn);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };

    voiceBtn.addEventListener("click", () => {
        voiceBtn.style.transform = "scale(1.2)";
        voiceBtn.style.background = "#ff4b2b";
        recognition.start();
        setTimeout(() => {
            voiceBtn.style.transform = "scale(1)";
            voiceBtn.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
        }, 500);
    });
} else {
    voiceBtn.style.display = "none";
    console.log("Speech recognition not supported");
}
