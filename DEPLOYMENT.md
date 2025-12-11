# Deployment Guide: Campus Event Chatbot

This guide explains how to deploy your chatbot backend to **Render.com** (a free hosting platform) so it can run 24/7 online.

## Prerequisites
- A GitHub account.
- The project pushed to a GitHub repository.

## Step 1: Prepare the Project
1.  Ensure your `backend/package.json` has a `start` script: `"start": "node server.js"`. (Already done!)
2.  Ensure your `backend/server.js` listens on `process.env.PORT`. (Already done!)
3.  Push your code to GitHub.

## Step 2: Create a Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Get your **Connection String** (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/...`).
4.  Replace `<password>` with your actual database password.

## Step 3: Deploy to Render
1.  Go to [Render.com](https://render.com) and sign up/login.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    - **Name**: `campus-event-chatbot` (or similar)
    - **Root Directory**: `backend` (Important! Since your server is in this folder)
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables**:
    - Click **Advanced** or **Environment**.
    - Add `MONGODB_URI`: Paste your MongoDB Connection String.
    - Add `TELEGRAM_BOT_LINK`: `https://t.me/EVENT254_BOT`
    - Add `WHATSAPP_BOT_LINK`: `https://wa.me/254718982047`
6.  Click **Create Web Service**.

## Step 4: Verify
- Wait for the deployment to finish.
- Render will give you a URL (e.g., `https://campus-event-chatbot.onrender.com`).
- Open `https://campus-event-chatbot.onrender.com/api/health` to check if it's running.

## Step 5: Update Frontend
- Since the frontend is now inside `backend/public`, it will automatically be served by your backend!
- However, if you hardcoded `http://localhost:5000` in `script.js`, you should change it to relative paths (e.g., `/api/events`) or the new domain.
- **Better approach**: I recommend updating `script.js` to use relative paths `/` by default so it works on both localhost and production without changing code!
