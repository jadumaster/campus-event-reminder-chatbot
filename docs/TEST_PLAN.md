# Test Plan: Campus Event Assistant

---

## 1. Introduction
This document outlines the testing strategy to ensure the Campus Event Chatbot meets all functional requirements.

## 2. Test Scope
-   **In Scope**: User Authentication, Event CRUD Operations, Chatbot Response Logic, Integrations (WhatsApp link, Calendar link).
-   **Out of Scope**: Performance load testing (10,000+ users), Payment gateway integration.

## 3. Test Environment
-   **OS**: Windows 10/11
-   **Browser**: Chrome (Latest), Edge
-   **Backend**: Node.js v14+
-   **Database**: MongoDB Atlas / Local

## 4. Test Cases

### 4.1 Authentication
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T1 | Register User | Enter valid username/pass, click Register | "Registration Successful", redirect to Login | ✅ Pass |
| T2 | Login User | Enter valid creds, click Login | Redirect to Dashboard, store Session | ✅ Pass |
| T3 | Invalid Login | Enter wrong password | Show "Invalid Credentials" alert | ✅ Pass |
| T4 | Logout | Click Logout button | Clear Session, Redirect to Login | ✅ Pass |

### 4.2 Dashboard & Events
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T5 | View Events | Click "Live Events" tab | List of cards with images display | ✅ Pass |
| T6 | WhatsApp Link | Click "Register" on event | Opens WhatsApp with pre-filled text | ✅ Pass |
| T7 | Calendar Link | Click "Add" (Green button) | Opens Google Calendar with event details | ✅ Pass |
| T8 | Past Events | Click "Past Events" tab | Shows expired events, "Review" button | ✅ Pass |

### 4.3 Chatbot
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T9 | Greeting | Type "Hi" | Bot replies "Hello there!..." | ✅ Pass |
| T10| Show Events | Type "Show events" | Bot lists upcoming events textually | ✅ Pass |
| T11| Unknown Cmd | Type "Random text" | Bot offers help menu | ✅ Pass |

### 4.4 Admin Functions
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T12| Admin Access | Login as Admin (`isAdmin: true`) | "Admin" tab is visible | ✅ Pass |
| T13| Delete Event | Click Delete in Admin tab | Event removed from DB and Lists | ✅ Pass |

## 5. Defect Report (Resolved)
-   **Bug**: Telegram 409 Conflict. **Fix**: Implemented Webhook Deletion before Polling.
-   **Bug**: WhatsApp Link Invalid. **Fix**: Updated number to +254... format.
-   **Bug**: Images missing. **Fix**: Seeded DB with Unsplash URLs.
