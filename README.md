# IoT Device Monitor Dashboard

A real-time web dashboard for monitoring IoT device metrics, built with **React** (frontend) and **Node.js** + **Express** (backend).  
The dashboard simulates IoT devices streaming live data such as temperature, battery level, and device status, updates charts in real-time, and supports authentication, reporting, and role-based access.

### Demo
https://youtu.be/8Z8ytru3QFM
<p align="center">
  <a href="https://youtu.be/8Z8ytru3QFM">
    <img src="https://img.youtube.com/vi/8Z8ytru3QFM/0.jpg" alt="Watch the video" />
  </a>
</p>
---

## Features
- **JWT-based authentication** (Admin/User roles)
- **Real-time IoT metrics** using WebSockets
- **Chart visualizations** with Chart.js
- **Export reports** as CSV for the last 24 hours
- **Role-based access control** admin vs regular user
- **Mock IoT device simulation** for demo purposes

---

## Technologies Used
### Frontend
- React
- Chart.js (for data visualization)
- Axios (API requests)
- CSS Modules / Custom styling

### Backend
- Node.js
- Express
- WebSocket (ws) for live data
- jsonwebtoken (JWT authentication)
- cors & dotenv

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/muizzkhan0/iot-dashboard.git
cd iot-dashboard
```
### 2. Install dependencies
Frontend:
```bash
cd client
npm install
```
Backend:
```bash
cd server
npm install
```

### 3. Environment Variables
You’ll need to create .env files in the backend/ folder.
This file is not included in the repo for security reasons.
```bash
JWT_SECRET=your_secret_here
PORT=4000
ORIGIN=http://localhost:5173
```

---

## Run the app
In two separate terminals:

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run dev
```
