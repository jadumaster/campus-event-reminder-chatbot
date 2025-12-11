# Master Test Plan

**Project:** Campus Event Assistant
**Version:** 1.5
**Testing Lead:** QA Team
**Date:** December 11, 2025

---

## 1. Introduction
This Master Test Plan (MTP) outlines the strategy, scope, resources, and schedule for testing the Campus Event Assistant. The primary goal is to ensure the application is robust, secure, and user-friendly before final delivery.

## 2. Test Scope

### 2.1 Features In-Scope
1.  **User Authentication Module**: Login, Registration, Session Management.
2.  **Event Management Module**: Viewing, Creating (Admin), and Deleting events.
3.  **Conversational Agent**: Command parsing ("Add event", "Show events") and Natural Language Processing.
4.  **Integration Points**: External links to WhatsApp and Google Calendar.
5.  **Data Integrity**: Review submission and persistence.

### 2.2 Features Out-of-Scope
1.  Payment Gateway Verification (Not implemented).
2.  Load Testing > 500 concurrent users.

## 3. Test Environment & Tools
*   **Hardware**: Standard PC (Windows 10/11, 8GB RAM).
*   **Software**: Google Chrome (v120+), Firefox (v115+).
*   **Test Data**: MongoDB "Seeded" data (mock events covering Past/Future dates).
*   **Tools**:
    *   **Manual Testing**: Browser interaction.
    *   **API Testing**: Postman / cURL.
    *   **Debugging**: Chrome DevTools Console.

## 4. Test Strategy

### 4.1 Unit Testing
*   **Objective**: Validate smallest testable parts.
*   **Focus**: Regex command parsers, Date formatting utility functions.

### 4.2 Integration Testing
*   **Objective**: Verify data flow between Client and Server.
*   **Focus**: JSON response structure, HTTP Status Codes (200 vs 400 vs 500).

### 4.3 User Acceptance Testing (UAT)
*   **Objective**: Validate system against user needs.
*   **Focus**: Usability, visual alignment, "Glassmorphism" rendering.

## 5. Detailed Test Cases

### 5.1 Module: Authentication
| Case ID | Scenario | Pre-Conditions | Test Steps | Expected Result | Result |
|:---|:---|:---|:---|:---|:---|
| **AUTH-01** | Successful Registration | Database allows new users | 1. Navigate to Login<br>2. Toggle "Register"<br>3. Enter unique User/Pass<br>4. Submit | Alert "Success", prompt to Login | **PASS** |
| **AUTH-02** | Duplicate User Handling | User "Admin" exists | 1. Register with username "Admin" | Warning "User already exists" | **PASS** |
| **AUTH-03** | Admin Privilege Check | Logged in as Admin | 1. Check Sidebar | "Admin Panel" tab is visible | **PASS** |

### 5.2 Module: Event Dashboard
| Case ID | Scenario | Pre-Conditions | Test Steps | Expected Result | Result |
|:---|:---|:---|:---|:---|:---|
| **DASH-01** | Live Event Rendering | DB has future events | 1. Click "Live Events" | Cards displayed with "Register" btn | **PASS** |
| **DASH-02** | Past Event Rendering | DB has past events | 1. Click "Past Events" | Cards displayed with "Review" btn | **PASS** |
| **DASH-03** | Image Fallback | Event has broken img URL | 1. Load Event Card | Default placeholder image loads | **PASS** |

### 5.3 Module: Integrations
| Case ID | Scenario | Pre-Conditions | Test Steps | Expected Result | Result |
|:---|:---|:---|:---|:---|:---|
| **INT-01** | WhatsApp Deep Link | None | 1. Click "Register" | Opens `wa.me` with pre-filled text | **PASS** |
| **INT-02** | Google Calendar Link | None | 1. Click "Add" (Green Icon) | Opens Calendar with Title/Date/Loc | **PASS** |

## 6. Bug Management
### 6.1 Severity Definitions
*   **Critical**: System crash or data loss.
*   **High**: Major feature failure (e.g., Login doesn't work).
*   **Medium**: UI/UX issues, minor logic errors.
*   **Low**: Typographical errors, color mismatches.

### 6.2 Resolved Defects
*   **[HIGH] Telegram 409 Conflict**: Fixed by implementing `deleteWebhook` before polling.
*   **[MED] Invalid Phone Error**: Fixed by updating `server.js` config.

## 7. Approval
*   **Approved By**: Project Manager
*   **Date**: 11/12/2025
