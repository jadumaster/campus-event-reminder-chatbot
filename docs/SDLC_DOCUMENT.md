# System Development Life Cycle (SDLC)

**Project:** Campus Event Assistant Chatbot
**Methodology:** Agile / Iterative
**Date:** December 11, 2025

---

## 1. Introduction
The System Development Life Cycle (SDLC) defines the framework used to structure, plan, and control the process of developing the Campus Event Assistant. This project adheres to the **Agile Methodology**, focusing on iterative development, flexibility, and customer feedback.

## Phase 1: Requirement Analysis & Planning
**Objective:** To clearly define the problem scope and feasibility.
*   **Inputs:** Initial problem statement ("Students missing events"), Stakeholder interviews.
*   **Activities:**
    *   Identified the need for a **Centralized Dashboard** vs. scattered WhatsApp groups.
    *   Determined key functional requirements: Chat capability, Admin control, User Reviews.
    *   Assessed technical feasibility of using Node.js and MongoDB.
*   **Deliverables:** Project Charter, Use Case Definitions.

## Phase 2: System Design
**Objective:** To create the architectural blueprint.
*   **Inputs:** Requirement Specification.
*   **Activities:**
    *   **Database Design:** Created Entity Relationship Diagrams (ERD) for Users and Events.
    *   **UI/UX Design:** Drafted wireframes for the "Glassmorphic" dashboard layout.
    *   **API Specification:** Defined JSON contracts for frontend-backend communication.
*   **Deliverables:** System Design Specification (SDS), Database Schema.

## Phase 3: Development (Implementation)
**Objective:** To write the actual code and build the system.
*   **Duration:** 2 Weeks (Sprints).
*   **Key Activities:**
    *   **Sprint 1 (Backend Core)**: Setup Express.js server, MongoDB connection, and Auth logic.
    *   **Sprint 2 (Frontend MVP)**: Built HTML5 structure and CSS3 styling.
    *   **Sprint 3 (Integrations)**: Implemented Telegram Polling and WhatsApp deep-linking.
    *   **Sprint 4 (Refinement)**: Added "Rich Event Cards" and "Past Event Reviews".
*   **Tools Used:** VS Code, Git, Postman, Node.js.
*   **Deliverables:** Source Code, GitHub Repository.

## Phase 4: Testing & Quality Assurance
**Objective:** To validate functionality and eliminate defects.
*   **Testing Types Performed:**
    *   **Unit Testing**: Verified individual functions (e.g., `extractEvent()` regex logic).
    *   **Integration Testing**: Ensured React-less frontend correctly fetches JSON from Node API.
    *   **System Testing**: Verified the End-to-End flow (Register -> Login -> Add Event -> View Event).
    *   **Regression Testing**: Ensured new features (Reviews) didn't break existing ones (Add Event).
*   **Defect Log:**
    *   *Issue*: Telegram Webhook Conflict (409 Error). *Resolution*: Added auto-delete webhook on startup.
*   **Deliverables:** Test Cases, Bug Reports.

## Phase 5: Deployment
**Objective:** To release the system to the production environment.
*   **Environment:** Cloud Hosting (Render.com).
*   **Activities:**
    *   Environment Variable Configuration (`MONGODB_URI`, `PORT`).
    *   Code Optimization (Removing hardcoded `localhost` URLs).
    *   Database Migration (Seeding initial "Campus Vybes" data).
*   **Deliverables:** Deployment Guide, Live URL.

## Phase 6: Maintenance & Future Scaling
**Objective:** To ensure long-term sustainability.
*   **Current Maintenance**: Log monitoring via Render Dashboard.
*   **Future Enhancements**:
    *   **v2.0**: Native mobile application (React Native).
    *   **v2.1**: AI-powered Event Recommendations based on user history.
    *   **v2.2**: QR Code generation for event ticketing ticket verification.
