# WhatsApp & Telegram Integration Guide

## WhatsApp Business API Setup

### Step 1: Get WhatsApp Credentials

1. Go to [Facebook Business Manager](https://business.facebook.com)
2. Create a Business Account or sign in
3. Go to **Apps & Websites** → Create a new app
4. Choose **Business** as the app type
5. Set up **WhatsApp** product
6. Get your:
   - **Access Token** (from API credentials)
   - **Phone Number ID** (from your WhatsApp Business account)
   - **Verify Token** (create any random string for security)

### Step 2: Configure Environment Variables

Add to `.env`:
```env
WHATSAPP_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_WEBHOOK_URL=https://your-domain.com/webhook/whatsapp
```

### Step 3: Set Up Webhook

1. In Facebook App Settings → Webhooks → Edit Subscriptions
2. Set callback URL: `https://your-domain.com/webhook/whatsapp`
3. Set Verify Token: (use the token from .env)
4. Subscribe to **messages** and **message_status** events

### Step 4: Test WhatsApp Integration

```bash
# Using curl to test webhook verification
curl -X GET "localhost:5000/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test_challenge&hub.verify_token=your_verify_token"
```

---

## Telegram Bot Setup

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy your **Bot Token** from BotFather

### Step 2: Configure Environment Variables

Add to `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/webhook/telegram
```

### Step 3: Set Up Webhook

The webhook is set up automatically when the server starts. You can also manually set it:

```bash
# Using curl
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-domain.com/webhook/telegram"}'
```

### Step 4: Test Telegram Integration

1. Find your bot on Telegram
2. Send a message to it
3. The bot should respond

---

## Local Testing with ngrok

For local development, use **ngrok** to expose your localhost to the internet:

### Install ngrok:
```bash
# Windows
choco install ngrok

# Or download from https://ngrok.com/download
```

### Run ngrok:
```bash
ngrok http 5000
```

This gives you a URL like: `https://abc123.ngrok.io`

### Update .env:
```env
WHATSAPP_WEBHOOK_URL=https://abc123.ngrok.io/webhook/whatsapp
TELEGRAM_WEBHOOK_URL=https://abc123.ngrok.io/webhook/telegram
```

---

## API Functions

### WhatsApp Functions

```javascript
// Send WhatsApp message
const { sendWhatsAppMessage } = require('./config/whatsapp');

sendWhatsAppMessage('1234567890', 'Hello from Campus Event Chatbot!');
```

### Telegram Functions

```javascript
// Send Telegram message
const { sendTelegramMessage, sendTelegramMessageWithButtons } = require('./config/telegram');

// Simple message
sendTelegramMessage(chatId, '<b>Hello</b> from Campus Event Chatbot!');

// Message with buttons
const buttons = [
    [{ text: "Add Event", callback_data: "add_event" }],
    [{ text: "Show Events", callback_data: "show_events" }]
];
sendTelegramMessageWithButtons(chatId, 'Choose an option:', buttons);
```

---

## Webhook Routes

### WhatsApp
- **POST** `/webhook/whatsapp` - Receive messages
- **GET** `/webhook/whatsapp` - Webhook verification

### Telegram
- **POST** `/webhook/telegram` - Receive messages and button presses

---

## Features Implemented

✅ Receive messages from WhatsApp  
✅ Receive messages from Telegram  
✅ Send messages to WhatsApp  
✅ Send messages to Telegram  
✅ Button/callback handling in Telegram  
✅ Webhook verification  
✅ Error handling and logging  

---

## Next Steps

1. Integrate the chatbot logic with event processing
2. Handle file uploads (images, documents)
3. Add typing indicators
4. Implement message read receipts
5. Add rich media support (buttons, carousels)

---

## Troubleshooting

**Webhook not connecting?**
- Check your domain/URL is accessible
- Verify token matches in settings
- Check server logs for errors

**Messages not being received?**
- Ensure webhook is properly configured
- Check subscription settings
- Verify credentials in .env

**Rate limiting?**
- WhatsApp: 1000 messages/day for new numbers
- Telegram: No limits for bots
- Add delays between messages if needed
