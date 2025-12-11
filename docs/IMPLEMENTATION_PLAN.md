# Implementation Plan

**Project**: Campus Event Assistant
**Timeline**: 4 Weeks (Mock)

---

## Week 1: Foundation & Setup
-   [x] **Day 1: Environment Setup**
    -   Initialize Node.js project.
    -   Install dependencies (`express`, `mongoose`, `cors`).
    -   Setup MongoDB Atlas cluster.
-   [x] **Day 2: Backend Core**
    -   Create Server.js structure.
    -   Define Mongoose Scheduling (Users, Events).
    -   Implement Connection Logic.

## Week 2: Core Functionality
-   [x] **Day 1: Authentication API**
    -   Build `/register` and `/login` routes.
    -   Implement Password Hashing.
-   [x] **Day 2: Event API**
    -   Build CRUD routes for Events (`GET`, `POST`, `DELETE`).
    -   Test with Postman.
-   [x] **Day 3: Frontend Skeleton**
    -   Create `index.html` layout.
    -   Implement initial CSS styling.

## Week 3: UI/UX & Chatbot
-   [x] **Day 1: Dashboard Implementation**
    -   Build Sidebar navigation.
    -   Create View Switching logic (SPA feel).
-   [x] **Day 2: Chat Interface**
    -   Build Chat UI (Bubbles, Input).
    -   Implement Basic NLP/Regex for commands.
-   [x] **Day 3: Styling Polish**
    -   Apply "Glassmorphism" theme.
    -   Ensure Responsiveness.

## Week 4: Integrations & Testing
-   [x] **Day 1: External Integrations**
    -   Telegram Bot connection.
    -   WhatsApp "Click-to-Chat" links.
-   [x] **Day 2: Advanced Features**
    -   Rich Event Cards (Images).
    -   Past Events & Reviews system.
-   [x] **Day 3: Testing & Deployment**
    -   Run Test Cases (see `TEST_PLAN.md`).
    -   Prepare `DEPLOYMENT.md`.
    -   Final Code Cleanup.
