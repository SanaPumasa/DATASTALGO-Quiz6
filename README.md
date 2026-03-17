# Auto Repair & Diagnostic Services Platform

A full-stack web application for automotive repair and diagnostic services with AI chatbot, subscriptions, and PayPal payment integration.

## ✨ Features

- 🔐 **Email-based authentication** with JWT tokens
- 🤖 **AI Chatbot** powered by Google Gemini 2.5 Flash
- 💳 **3-tier subscription plans** (Basic, Professional, Enterprise)
- 💰 **PayPal Sandbox** for recurring subscription payments
- 📊 **Service catalog** browsing
- 👤 **User profiles** and account management
- ❌ **Auto-subscription** - all new users get Basic plan
- 📈 **Real-time usage tracking** for messages

## 🛠️ Tech Stack

**Backend:** Django 6.0.2 • DRF 3.16.1 • SQLite3 • Gemini AI • PayPal API  
**Frontend:** React 18 • Redux • Axios • PayPal SDK

## 📁 Project Structure

```
Quiz6/
├── backend/                    # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── users/                  # Authentication
│   ├── subscriptions/          # Subscription & PayPal
│   ├── chat/                   # Gemini chatbot
│   └── services/               # Service catalog
├── frontend/                   # React app
│   ├── src/
│   │   ├── components/         # ChatBot, SubscriptionScreen, PayPalButton
│   │   ├── pages/
│   │   ├── redux/              # State management
│   │   └── App.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Backend Setup

```sh
# Clone and navigate
git clone https://github.com/SanaPumasa/DATASTALGO-Quiz6.git
cd Quiz6/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add: SECRET_KEY, DEBUG=True, GEMINI_API_KEY, PAYPAL_CLIENT_ID

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```sh
# Navigate to frontend
cd ../frontend

# Install and start
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your-google-gemini-api-key
PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
PAYPAL_API_SECRET=your-paypal-sandbox-secret
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
```

> **Note:** Get PayPal Sandbox credentials from [developer.paypal.com](https://developer.paypal.com/dashboard)

## 💳 Subscription Plans

| Plan | Price | Messages/Month | Plan ID |
|------|-------|---|---|
| Basic | $9.99 | 10 | P-462646207K9508707NG4ZHPA |
| Professional | $19.99 | 30 | P-79150757NY4230220NG4ZIEA |
| Enterprise | $49.99 | 100 | P-22X726627R009924VNG4ZILY |

## 📡 API Endpoints

**Authentication**
- `POST /api/v1/users/register/` - Register
- `POST /api/v1/users/login/` - Login

**Subscriptions**
- `GET /api/v1/subscriptions/tiers/` - Get all tiers
- `GET /api/v1/subscriptions/user/` - Get user's subscription
- `POST /api/v1/subscriptions/paypal/activate-subscription/` - Activate after PayPal approval

**Chat**
- `POST /api/v1/chat/message/` - Send message to AI
- `GET /api/v1/chat/history/` - Get chat history

**Services**
- `GET /api/v1/services/` - List all services
- `GET /api/v1/services/{id}/` - Service details

## 📦 Core Models

| Model | Fields |
|-------|--------|
| **CustomUser** | email, first_name, last_name, password |
| **SubscriptionTier** | name, price, max_usage, paypal_plan_id |
| **UserSubscription** | user, tier, messages_consumed, paypal_subscription_id |
| **ChatMessage** | user, message, response, timestamp |
| **Service** | name, description, category, price |

## 🐛 Common Issues

**"Failed to load PayPal SDK"**
- Check `REACT_APP_PAYPAL_CLIENT_ID` in `frontend/.env`
- Run `npm run build` after updating `.env`
- Restart: `npm start`

**Backend not connecting**
- Verify Django runs on `http://localhost:8000`
- Check `REACT_APP_API_URL` matches backend URL
- Ensure CORS is configured in Django

**Database errors**
- Reset: `rm db.sqlite3` then `python manage.py migrate`
- Check all apps in `INSTALLED_APPS`

## 📚 Resources

- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [Gemini API](https://ai.google.dev/)
- [PayPal API](https://developer.paypal.com/docs/)

## 📝 Notes

- Never commit `.env` files (included in `.gitignore`)
- JWT tokens expire after 1 hour
- Use PostgreSQL for production instead of SQLite
- Run tests: `python manage.py test` (backend) or `npm test` (frontend)

---

**Version:** 1.0.0 | **Updated:** March 18, 2026
