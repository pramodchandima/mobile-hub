# 📱 Mobile Hub Website

## Description

**Mobile Hub** is a premium, full-stack e-commerce platform for mobile devices and accessories. It features a stunning glassmorphic UI, a robust Node.js backend, and a comprehensive administrative portal for complete store management.

---

## 📋 Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Running Locally](#installation--running-locally)
- [Environment Variables](#environment-variables)
- [Admin Access](#admin-access)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

---

## 🛠️ Technologies

- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MySQL (InnoDB)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Media:** Multer for image/video uploads

---

## ✨ Features

### 👤 User Features

- **Premium UI:** Modern, responsive design with glassmorphism and animations.
- **Product Discovery:** Browse by category, search, and view detailed specifications.
- **Interactive:** Add to cart and seamless contact forms.

### 👨‍💼 Admin Features

- **Dashboard:** Real-time analytics and store overview.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) for products and variants.
- **Category Management:** Organze your store with custom categories and images.
- **Dynamic Content:** Update home sections, hero carousels, and promotional videos directly from the panel.

---

## 📁 Project Structure

```text
Mobile Hub/
├── backend/                # Node.js backend API
│   ├── src/
│   │   ├── config/         # DB and Env configurations
│   │   ├── controllers/    # API Request handlers
│   │   ├── middleware/     # Auth and Upload filters
│   │   ├── routes/         # Express routes
│   └── server.js           # Server entry point
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Full page views
│   │   └── config/         # API Base configuration
├── mobileHub.sql           # Database schema & initial data
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

---

## 💻 Installation & Running Locally

### Prerequisites

- Node.js (v16+)
- MySQL Server

### 1. Database Setup

1. Create a new database in MySQL:
   ```sql
   CREATE DATABASE mobileHub;
   ```
2. Import the schema:
   ```bash
   mysql -u root -p mobileHub < mobileHub.sql
   ```

### 2. Backend Setup

1. Navigate to `/backend` and install dependencies:
   ```bash
   npm install
   ```
2. Configure your `.env` file (see [Environment Variables](#environment-variables)).
3. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup

1. Navigate to `/frontend` and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mobileHub
JWT_SECRET=your_secure_random_string

# Admin Setup (Defaults)
ADMIN_USERNAME=admin123
ADMIN_PASSWORD=1111
```

---

## 🔑 Admin Access

- **Admin Portal:** `http://localhost:3000/shop-admin-portal-2002`
- **Default Credentials:**
  - **Username:** `admin123`
  - **Password:** `1111`

> [!TIP]
> If you ever recreate the database and need to quickly reset the admin account, ensure the backend is running and visit:
> `http://localhost:5000/api/setup-admin`

---

## 🐛 Troubleshooting

| Issue                          | Solution                                                                        |
| :----------------------------- | :------------------------------------------------------------------------------ |
| **Database Connection Error**  | Verify MySQL is running and credentials in `.env` match.                        |
| **Broken Images**              | Ensure the `backend/uploads` folder exists and has permissions.                 |
| **Invalid Token Error**        | Log out of the Admin Panel and log back in to refresh your session.             |
| **White Screen on Categories** | Ensure the backend is running; the frontend needs the API to render categories. |

---

## 👨‍💻 Author

**Pramod Chandima**
_Full-stack Developer | Tech Enthusiast_

---

## 📄 License

This project is for personal use and learning. All rights reserved.

---

_Happy Coding! 🚀_
