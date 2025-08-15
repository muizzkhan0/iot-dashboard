# IoT Device Monitor Dashboard

A real-time web dashboard for monitoring IoT device metrics, built with **React** (frontend) and **Node.js** + **Express** (backend).  
The dashboard simulates IoT devices streaming live data such as temperature, battery level, and device status, updates charts in real-time, and supports authentication, reporting, and role-based access.

---

## Features
- **JWT-based authentication** (Admin/User roles)
- **Real-time IoT metrics** using WebSockets
- **Chart visualizations** with Chart.js
- **Export reports** as PDF or CSV for the last 24 hours
- **Role-based access control**
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
git clone https://github.com/your-username/iot-dashboard.git
cd iot-dashboard
