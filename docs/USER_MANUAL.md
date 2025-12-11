# User Manual: Campus Event Assistant

## 1. Getting Started
### Prerequisites
-   A modern web browser (Chrome, Edge, Firefox).
-   Internet connection (for loading data).

### Accessing the System
1.  Navigate to the deployed URL (e.g., `https://your-app.onrender.com`) or access locally at `http://localhost:5000`.

## 2. Registration & Login
-   **New Users**: Click "Register" on the login screen. Enter a unique username and password.
-   **Returning Users**: Enter your credentials and click "Login".
-   *Note: Only Admins can see the "Admin" tab.*

## 3. Dashboard Overview
The dashboard is divided into several sections:
-   **Chat Assistant**: Your AI helper for quick queries.
-   **Live Events**: View upcoming cards with "Register" and "Calendar" buttons.
-   **Past Events**: View archive and leave reviews.
-   **Integrations**: Quick links to WhatsApp/Telegram bots.
-   **Quick Guide**: Help documentation.

## 4. Using the Chatbot
Type commands in the chat box or use the microphone button.
-   **"Hi"**: Greets the bot.
-   **"Show events"**: Lists all upcoming event titles.
-   **"Add event: [Name] on [Date] at [Time]"**: Saves a personal reminder.
-   **"Delete event [1]"**: Deletes the first event in your list.

## 5. Managing Events (Admin Only)
1.  Navigate to the **Admin** tab (visible only if `isAdmin=true`).
2.  **Add Event**: Content pending (Planned feature).
3.  **Delete Event**: Click the "Delete" button next to any event in the list.

## 6. Integrations
-   **WhatsApp**: Click "Connect WhatsApp" to open a chat with the bot.
-   **Google Calendar**: On any event card, click the **Green Calendar Icon** to instantly add the event to your schedule.
