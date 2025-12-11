# System Development Life Cycle (SDLC) Document

**Project:** Campus Event Assistant Chatbot
**Methodology:** Agile / Iterative

---

## 1. Phase 1: Requirement Analysis
**Goal**: Understand the problem and define scope.
-   **Activities**:
    -   Analyzed the problem of "missed campus events".
    -   Identified key stakeholders: Students, Event Organizers.
    -   Defined core requirements: Chat interface, Dashboard, User Auth, Integrations.
-   **Outcome**: Requirement Specification Document (see Project Report).

## 2. Phase 2: System Design
**Goal**: Blueprint the technical solution.
-   **Activities**:
    -   Selected Tech Stack: MERN (MongoDB, Express, Node) sans React (Vanilla JS chose for simplicity).
    -   Designed Database Schema (Users, Events).
    -   Created UI Mockups (Glassmorphism concept).
-   **Outcome**: System Design Specification (SDS).

## 3. Phase 3: Implementation (Coding)
**Goal**: Translate design into working code.
-   **Activities**:
    -   **Backend**: Setup Express server, connected MongoDB, built API routes.
    -   **Frontend**: Developed HTML structure, styled with CSS/Glassmorphism, implemented JS logic.
    -   **Integrations**: Added WhatsApp link generator and Telegram bot polling.
-   **Outcome**: Source Code (GitHub Repo).

## 4. Phase 4: Testing
**Goal**: Ensure system reliability and bug-free operation.
-   **Activities**:
    -   **Unit Testing**: Tested individual API endpoints (Postman).
    -   **Integration Testing**: Verified Frontend-Backend communication (Login flow, Fetch events).
    -   **User Acceptance Testing (UAT)**: Verified features like "Add to Calendar" and "WhatsApp Register".
-   **Outcome**: Test Plan and Bug Fixes (e.g., Fixed Telegram 409 Conflict).

## 5. Phase 5: Deployment
**Goal**: Make the system accessible.
-   **Activities**:
    -   Configured project for production (Relative paths).
    -   Created Deployment Guide (`DEPLOYMENT.md`).
    -   Prepared for hosting on Render.com.
-   **Outcome**: Live URL (Pending hosting).

## 6. Phase 6: Maintenance
**Goal**: Keep system running and improve.
-   **Activities**:
    -   Monitor logs for errors.
    -   Plan future features: AI Recommendations, Mobile App.
