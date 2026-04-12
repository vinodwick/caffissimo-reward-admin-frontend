# Caffissimo Reward Admin Frontend v2

> A professional loyalty management portal for Caffissimo franchise operations — built with React 19, Vite, and TailwindCSS v4.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Deployment with PM2](#deployment-with-pm2)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [API Integration](#api-integration)
- [Branch Strategy](#branch-strategy)
- [Build for Production](#build-for-production)
- [Default Login](#default-login)

---

## Overview

The Caffissimo Admin Frontend v2 is the staff-facing management portal for the Caffissimo loyalty rewards platform. It provides branch staff, branch managers, and franchise admins with tools to:

- Record customer visits and award points
- Search and manage customer profiles
- Activate and redeem free-item rewards
- Manage branches, promotions, and users
- View real-time loyalty reports and analytics

This portal is designed to work seamlessly with the **Caffissimo Reward API Server** (powered by Node.js / Express).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19.x | UI framework |
| [Vite](https://vite.dev) | 8.x | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com) | 4.x | Utility-first CSS framework |
| [React Router DOM](https://reactrouter.com) | 7.x | Client-side routing |
| [React Icons](https://react-icons.github.io) | 5.x | Icon library |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | 2.x | QR code scanner |

---

## Prerequisites

Ensure the following are installed on your system before proceeding:

| Tool | Minimum Version | Check Command |
|---|---|---|
| [Node.js](https://nodejs.org) | 18.x or higher | `node -v` |
| [npm](https://www.npmjs.com) | 9.x or higher | `npm -v` |
| [Git](https://git-scm.com) | 2.x or higher | `git --version` |

> [!IMPORTANT]
> The **Caffissimo Reward API Node Server** must be running before starting this app. While it supports the original Laravel backend, the Node implementation is the current recommended development environment.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vinodwick/caffissimo-reward-admin-frontend.git
cd caffissimo-reward-admin-frontend
```

### 2. Switch to the Development Branch

```bash
git checkout develop
```

### 3. Install Dependencies

```bash
npm install
```

This will install all packages defined in `package.json` including React, Vite, TailwindCSS, and all other dependencies.

---

## Environment Setup

The app connects to the Node.js backend API. By default, it points to `http://localhost:8000/api/v1`.

### Local Development
To connect to your local Node server, ensure it is running on port 8000. You can override the default API URL by creating an `.env.local` file in the project root:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The app handles the `VITE_API_BASE_URL` automatically via the setup in `src/services/api.js`.

---

## Running the App

### 1. Start the Node.js Backend
Ensure your Node server is running:
```bash
cd node-backend
npm start
```

### 2. Start the Admin Frontend
In a separate terminal:
```bash
cd admin-v2-app
npm run dev
```

The app will start at `http://localhost:5177`.

> The port is fixed to `5177` via `vite.config.js` (`strictPort: true`). If this port is in use, free it before starting.

### Other Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## Deployment with PM2

To keep the development or preview server running continuously:

### 1. Installation
Install PM2 globally using npm:
```bash
npm install -g pm2
```

### 2. Start Your App
Navigate to the `admin-v2-app` folder and run:
```bash
# To run the development server
pm2 start npm --name "caffissimo-admin" -- run dev

# To run the production preview (after npm run build)
pm2 start npm --name "caffissimo-admin" -- run preview
```

### 3. Enable Startup Persistence
To ensure the app starts after a server reboot:
1. Run `pm2 startup`. Follow the instructions to copy and paste the command it generates.
2. Save your current process list by running:
```bash
pm2 save
```

### 4. Manage Your App
- `pm2 status`: View running processes.
- `pm2 logs`: View real-time application logs.
- `pm2 stop caffissimo-admin`: Stop the application.

---

## Project Structure

```
admin-v2-app/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── assets/              # Images and static media
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Side navigation menu
│   │   └── QRScanner.jsx    # QR code scanner component
│   ├── pages/               # Full-page route components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── AddCustomer.jsx
│   │   ├── ViewCustomer.jsx
│   │   ├── RecordVisit.jsx
│   │   ├── RedeemReward.jsx
│   │   ├── Rewards.jsx
│   │   ├── Branches.jsx
│   │   ├── Promotions.jsx
│   │   ├── VisitRewards.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   ├── Users.jsx
│   │   └── Help.jsx
│   ├── services/
│   │   └── api.js           # Centralised API client
│   ├── App.jsx              # Root component & router
│   ├── App.css              # Global app styles
│   ├── index.css            # TailwindCSS base styles
│   └── main.jsx             # App entry point
├── index.html               # HTML template
├── vite.config.js           # Vite + TailwindCSS config
├── eslint.config.js         # ESLint rules
└── package.json             # Dependencies and scripts
```

---

## Available Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Staff email + password authentication |
| `/dashboard` | Dashboard | KPI metrics, activity summary, quick actions |
| `/customers` | Customers | Search and browse all registered customers |
| `/customers/add` | Add Customer | Register a new customer manually |
| `/customers/:id` | View Customer | Full customer profile, visit history, rewards |
| `/visits/record` | Record Visit | Log a customer visit via phone, email, or QR scan |
| `/rewards/redeem` | Redeem Reward | Process a free-item reward redemption |
| `/rewards` | Rewards | Browse all rewards by status |
| `/branches` | Branches | Manage franchise branch locations |
| `/promotions` | Promotions | Create and manage loyalty promotions |
| `/visit-rewards` | Visit Rewards | Configure periodic visit reward items |
| `/reports` | Reports | Visit, points, and reward analytics |
| `/settings` | Settings | Loyalty rules, tier thresholds, wallet branding |
| `/users` | Users | Manage admin and staff user accounts |
| `/help` | Help | Usage guide and support information |

---

## API Integration & JWT Security

The application communicates with the backend via a centralized API service in `src/services/api.js`.

### Connecting to the API
- **Default Base URL:** `http://localhost:8000/api/v1`
- **Environment Override:** You can change this by creating a `.env.local` file with:
  ```
  VITE_API_BASE_URL=http://your-node-server-address/api/v1
  ```

### JWT Authentication Flow
The Node.js backend uses **JSON Web Tokens (JWT)** for secure, stateless authentication.

1.  **Login:** When you log in with your email and password, the server verifies your credentials and returns a `token` (JWT) and `user` object.
2.  **Token Storage:** The JWT is automatically saved in browser `localStorage` under the key `admin_token`.
3.  **Automatic Header:** Every request made via the `api` service automatically injects the token into the headers:
    ```http
    Authorization: Bearer <your_jwt_token>
    ```
4.  **Session Security:** 
    - The token is signed using the `JWT_SECRET` defined on the Node server.
    - If a request is made with an invalid or expired token, the server returns a `401 Unauthorized` status.
    - The app detects this `401` error, clears the invalid token from `localStorage`, and immediately redirects the user to the Login page.

### Multi-part Data Support
For features like **Branding Logs** and **Visit Reward Images**, the API service uses `FormData` objects to handle multi-part file uploads while still maintaining the JWT authorization header.

---

## Branch Strategy

This project follows **Git Flow**:

| Branch | Purpose |
|---|---|
| `main` | Production-stable releases only |
| `develop` | Active development — all work merged here |
| `feature/*` | Individual feature branches, merged into `develop` |
| `release/*` | Release preparation, merged into `main` + `develop` |
| `hotfix/*` | Emergency production fixes, merged into `main` + `develop` |

**For day-to-day development, always work on `develop`:**

```bash
git checkout develop

# Create a feature branch
git checkout -b feature/your-feature-name

# After work is done
git checkout develop
git merge feature/your-feature-name
git push origin develop
```

---

## Build for Production

```bash
npm run build
```

Output will be placed in the `dist/` folder. Deploy the contents of `dist/` to your web server or CDN.

For a reverse proxy setup (e.g. Nginx), add the following to handle React Router's client-side routing:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Default Login

After seeding the Node.js backend, use these credentials to log in:

| Field | Value |
|---|---|
| Email | `admin@caffissimo.com.au` |
| Password | `Admin@1234` |

> Change the admin password immediately after first login in a production environment.

---

## Related Repositories

| Repo | Description |
|---|---|
| [caffissimo-reward-api-node-server](https://github.com/vinodwick/caffissimo-reward-api-node-server) | Node.js / Express Backend |
| [caffissimo-reward-admin-frontend](https://github.com/vinodwick/caffissimo-reward-admin-frontend) | This repository — Admin portal |

---

*Caffissimo Australia — Loyalty & Rewards Platform*
