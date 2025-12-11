# Campus Event Chatbot

A modern, AI-powered chatbot for managing campus events, featuring a comprehensive dashboard, user authentication, admin event management, and integrations.

## Features

✨ **Frontend Dashboard:**
- **Sidebar Navigation**: Switch between Chat, Live Events, Past Events, Admin Panel, and Integrations.
- **Authentication**: secure Login & Registration system with password hashing.
- **Admin Dashboard**: Dedicated panel for admins to add and delete events.
- **Interactive Chat**: AI-like typing effects, specific commands, and voice input.
- **Integrations**: Connect with Telegram (@EVENT254_BOT) and WhatsApp.
- **Glassmorphic UI**: Premium design with gradient buttons and smooth transitions.

🔧 **Backend API:**
- **Event Management**: Create, read, update, delete events.
- **User Authentication**: Register (`/api/register`) and Login (`/api/login`).
- **Password Retrieval**: Simulated forgot password flow (`/api/forgot-password`).
- **Search & Filters**: Find events by keyword or category.
- **Bot Integrity**: Webhooks for Telegram and WhatsApp.
- **Deployment Ready**: Configured for cloud hosting (Render/Heroku).

## Project Structure

```
campus event chatbot/
├── backend/
│   ├── config/            # Database & Bot configs
│   ├── models/            # Mongoose Models (Event.js, User.js)
│   ├── server.js          # Main Express server
│   ├── package.json       # Backend Dependencies
│   └── .env               # Environment Variables
├── frontend/
│   ├── index.html         # Main Dashboard UI
│   ├── script.js          # App Logic (Auth, Chat, Admin)
│   └── style.css          # Glassmorphic Styles
├── DEPLOYMENT.md          # Guide to host the bot online
└── README.md              # Project Documentation
```

## System Architecture

```mermaid
graph TD
    User[👤 User] -->|Interacts| UI[🖥️ Frontend Dashboard]
    UI -->|HTTP Requests| API[⚙️ Backend API (Express)]
    
    subgraph Frontend
        UI -- Chats --> ChatBot[💬 Chat Interface]
        UI -- Views Files --> Views[📅 Events & Admin]
    end

    subgraph Backend
        API -->|Auth| Auth[🔐 Authentication]
        API -->|CRUD| DB[(🗄️ MongoDB)]
        API -->|Webhooks| Bots[🤖 Bot Integrations]
    end

    Bots -->|Updates| TG[✈️ Telegram]
    Bots -->|Updates| WA[📱 WhatsApp]
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   Create `backend/.env` with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-event-chatbot
   PORT=5000
   TELEGRAM_BOT_LINK=https://t.me/EVENT254_BOT
   ```

3. **Start Backend**:
   ```bash
   npm start
   ```

4. **Run Frontend**:
   Open `frontend/index.html` in your browser.

## API Endpoints

### Authentication
- `POST /api/register` - Create account
- `POST /api/login` - Login user
- `POST /api/forgot-password` - Request password reset (mock)

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Add event
- `DELETE /api/events/:id` - Delete event
- `GET /api/upcoming` - Next 7 days events

## Deployment
This project is ready for deployment! See [DEPLOYMENT.md](DEPLOYMENT.md) for a step-by-step guide to hosting on **Render.com**.

## License
ISC
