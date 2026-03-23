# Mobile Hub Website

## Description

Mobile Hub is a full-stack mobile shop website with a frontend and backend.  
It allows users to browse and buy mobile devices and accessories, while admins can manage products, orders, and users. The website is responsive and works on both desktop and mobile devices.

---

## Technologies

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Other:** Axios for API requests, JWT for authentication

---

## Features

### User Features

- Browse products by category
- View product details
- Add products to cart
- Place orders
- User authentication (Sign Up / Login)

### Admin Features

- Manage products (Add / Edit / Delete)
- Manage orders
- View customer messages
- Admin dashboard for analytics

### General

- Responsive design
- Secure authentication
- Organized folder structure

---

## Project Structure

Mobile Hub/
├─ backend/ # Node.js backend
│ ├─ src/
│ │ ├─ controllers/ # Backend logic
│ │ ├─ middleware/ # Auth, uploads, etc.
│ │ ├─ routes/ # API endpoints
│ │ └─ utils/ # Helper functions
│ ├─ scripts/ # DB migration / testing scripts
│ ├─ server.js # Entry point
│ └─ package.json
├─ frontend/ # React frontend
│ ├─ src/
│ │ ├─ components/ # Reusable components
│ │ ├─ pages/ # Pages like Home, Shop, Admin
│ │ ├─ config/ # API config
│ │ └─ styles/ # CSS files
│ ├─ public/ # Static assets
│ └─ package.json
├─ Images/ # Product images
├─ mobileHub.sql # Database script
├─ .gitignore
├─ README.md
├─ package.json
└─ tailwind.config.js

---

## Installation & Running Locally

### Backend

```bash
cd backend
npm install
npm start
Backend runs on http://localhost:5000 (default)
Frontend
cd frontend
npm install
npm start
Frontend runs on http://localhost:3000

Make sure backend is running first to allow frontend API calls.

Deployment
Frontend (Vercel / Netlify)
Push your frontend folder to GitHub
Sign in to Vercel
 or Netlify
Create a new project → Import from GitHub
Build command: npm run build
Output directory: build
Deploy → Copy the live URL
Backend (Render / Railway)
Push your backend folder to GitHub
Sign in to Render
 or Railway
Create a new Web Service → Connect GitHub repo
Start command: npm install && npm start
Set environment variables (DB credentials, JWT secret, etc.)
Deploy → Copy the live backend URL
Connect Frontend → Backend
In frontend/src/config/api.js, replace local API URL with your deployed backend URL
export const API_URL = "https://your-backend-url.com/api";
Notes
Large media files (*.mp4) and backup files (*.bak) are ignored via .gitignore
Keep sensitive files like .env out of GitHub
Use .gitignore to prevent unnecessary files from being committed
Author

Pramod Chandima
Full-stack developer | Student | Tech enthusiast

License

This project is for learning and personal use. No commercial use without permission.
```
