# Project Report: Campus Event Assistant Chatbot

**Course:** [Insert Course Name]
**Student Name:** [Insert Your Name]
**Date:** [Insert Date]

---

## 1. Abstract
The **Campus Event Assistant** is a web-based conversational agent designed to streamline event management within educational institutions. By leveraging natural language processing and a centralized dashboard, the system addresses the challenge of fragmented event information, ensuring students stay informed and engaged.

## 2. Introduction
University campuses are hubs of activity, with numerous events occurring daily—from academic workshops to social gatherings. However, information about these events is often scattered across NOTICE boards, social media, and emails, leading to low attendance and missed opportunities. This project proposes a **Chatbot-driven Dashboard** to centralize this data.

## 3. Problem Statement
-   **Information Overload**: Students miss events due to the sheer volume of unorganized notifications.
-   **Static Interfaces**: Traditional calendars lack interactivity and instant query resolution.
-   **Lack of Integration**: Event details are rarely integrated with students' personal tools like WhatsApp or Google Calendar.

## 4. Objectives
1.  **Centralize Information**: Provide a single source of truth for all campus events.
2.  **Enhance Accessibility**: Enable users to find events using natural language commands (e.g., "Show me parties this week").
3.  **Streamline Management**: Provide administrators with intuitive tools to create and manage events.
4.  **Boost Engagement**: Facilitate easy registration via popular platforms like WhatsApp.

## 5. System Requirements

### 5.1 Functional Requirements
-   **User Authentication**: Secure registration and login.
-   **Event Management**: Admin rights to Create, Read, Update, and Delete (CRUD) events.
-   **Chat Interface**: A bot that responds to queries like "Show events", "Add event", etc.
-   **Rich Media**: Support for event images and review systems.
-   **Integrations**: Direct links to WhatsApp/Telegram and One-click Google Calendar addition.

### 5.2 Non-Functional Requirements
-   **Usability**: Intuitive "Glassmorphism" UI design.
-   **Performance**: Fast load times using a lightweight tech stack.
-   **Security**: Password hashing and session management.

## 6. System Design

### 6.1 Architecture
The system follows a **Client-Server Architecture**:
-   **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
-   **Backend**: Node.js with Express.js REST API.
-   **Database**: MongoDB (NoSQL) for flexible data storage.

### 6.2 Database Schema
-   **Users Collection**: Stores `username`, `password` (hashed), and `isAdmin` status.
-   **Events Collection**: Stores `title`, `date`, `time`, `location`, `image`, `description`, and `reviews`.

## 7. Implementation & Technology Stack
-   **Frontend**: Built with vanilla HTML/JS for maximum control and performance. Styles use modern CSS variables for theming.
-   **Backend**: Express.js handles API routing and middleware.
-   **Database**: MongoDB Atlas cloud cluster for persistence.
-   **Version Control**: Git and GitHub for source code management.

## 8. Conclusion
The Campus Event Chatbot successfully bridges the gap between event organizers and students. By combining a visual dashboard with conversational AI, it offers a modern, efficient solution to campus engagement. Future improvements could include AI-driven event recommendations and mobile app development.

---
