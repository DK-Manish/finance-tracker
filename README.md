# 💰 Finance Tracker

A full-stack personal finance tracking application built with **FastAPI**, **React**, **PostgreSQL**, and **JWT authentication**.

![Dashboard](docs/screenshots/dashboard.png)

## ✨ Features

- 🔐 Secure user authentication with JWT tokens
- 💸 Add and delete income & expense transactions
- 📊 Visual charts — income vs expenses (doughnut) and spending by category (bar)
- 🏦 Real-time balance, income, and expense summary cards
- 🔒 All routes protected — users only see their own data

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Chart.js, React Router |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL |
| Auth | JWT (PyJWT), bcrypt password hashing |
| API Testing | Postman |

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16+

### Backend Setup

```bash
cd backend
pipenv install
cp .env.example .env  # fill in your database credentials
pipenv run uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## 📸 Screenshots

### Login Page
![Login](docs/screenshots/login.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

## 📁 Project Structure