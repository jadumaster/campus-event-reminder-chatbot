# Campus Event Chatbot

A modern, AI-powered chatbot for managing campus events with voice support, real-time suggestions, and a futuristic glassmorphic UI.

## Features

✨ **Frontend Features:**
- AI-like animated typing effects
- Voice input with Web Speech API
- Interactive emoji reactions
- Auto-complete command suggestions
- Glassmorphic UI with gradient buttons
- Smooth animations and transitions

🔧 **Backend Features:**
- RESTful API for event management
- Create, read, update, and delete events
- Search events by keyword
- Get upcoming events (next 7 days)
- CORS enabled for frontend integration
- Health check endpoint

## Project Structure

```
campus event chatbot/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── package.json       # Dependencies
│   └── .gitignore
├── frontend/
│   ├── index.html         # Main chatbot UI
│   ├── script.js          # Frontend logic with futuristic features
│   └── style.css          # Glassmorphic styling
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MongoDB connection in `.env`:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/campus-event-chatbot
   
   # Or for MongoDB Atlas (cloud)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-event-chatbot
   
   PORT=5000
   NODE_ENV=development
   ```

4. Start MongoDB:
   ```bash
   # Windows (if installed locally)
   net start MongoDB
   
   # Or use MongoDB Atlas (no local setup needed)
   ```

5. Start the server:
   ```bash
   npm start
   ```
   
   Or use development mode with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Open `frontend/index.html` in your browser
2. Or navigate to `http://localhost:5000` after starting the backend

## API Endpoints

### Events Management

**Get All Events**
```http
GET /api/events
```

**Add New Event**
```http
POST /api/events
Content-Type: application/json

{
  "title": "Meeting",
  "date": "10 March",
  "time": "2pm",
  "description": "Important team meeting",
  "location": "Auditorium A",
  "category": "Academic",
  "attendees": 50
}
```

**Get Event by ID**
```http
GET /api/events/:id
```

**Update Event**
```http
PUT /api/events/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "date": "11 March",
  "time": "3pm",
  "description": "Updated description",
  "location": "Auditorium B",
  "category": "Social",
  "attendees": 75
}
```

**Delete Event**
```http
DELETE /api/events/:id
```

### Search & Filter

**Search Events by Keyword**
```http
GET /api/search/:keyword
```

**Get Events by Category**
```http
GET /api/events/category/:category

# Categories: Academic, Social, Sports, Cultural, Workshop, Other
```

**Get Upcoming Events (Next 7 Days)**
```http
GET /api/upcoming
```

### System

**Health Check**
```http
GET /api/health
```

## Chatbot Commands

- **Add Event**: "Add event: Meeting on 10 March at 2pm"
- **Show Events**: "Show events" or "My events" or "List events"
- **Delete Event**: "Delete event 1"
- **Voice Input**: Click the 🎤 button to speak

## Technologies Used

### Frontend
- HTML5
- CSS3 (Glassmorphism, Gradients, Animations)
- JavaScript ES6+ (Vanilla, Web Speech API)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- CORS & Body Parser
- Environment Variables (dotenv)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication
- Event categories and filtering
- Email notifications
- Calendar integration
- Multi-language support
- Advanced NLP for better command parsing

## License

ISC
