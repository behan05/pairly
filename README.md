![version](https://img.shields.io/badge/version-v0.1.0--beta-blue)

---

# Pairly – Real-Time Couple-Friendly Chat App

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](./CONTRIBUTING.md)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)
![Status](https://img.shields.io/badge/status-active-success)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)
![Backend: Node](https://img.shields.io/badge/Backend-Express%20%7C%20MongoDB-brightgreen?logo=node.js)
![Issues](https://img.shields.io/github/issues/behan05/real-time-chat-app)
![Forks](https://img.shields.io/github/forks/behan05/real-time-chat-app)
![Stars](https://img.shields.io/github/stars/behan05/real-time-chat-app)
![Last Commit](https://img.shields.io/github/last-commit/behan05/real-time-chat-app)

A full-stack real-time chat application that connects users anonymously for private 1-on-1 messaging. Built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**.

---

#### _Read docs in other languages._

<kbd>[<img title="Bahasa Indonesia" alt="Bahasa Indonesia" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/id.svg" width="22">](docs/translations/README.id.md)</kbd>
<kbd>[<img title="Español" alt="Español" src="https://cdn.statically.io/gh/hjnilsson/country-flags/master/svg/es.svg" width="22">](docs/translations/README.es.md)
</kbd>

---

## 📚 Table of Contents

- [Preview](#preview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Made by Contributors](#made-by-contributors)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)
- [License](#license)

---

## 🖼️ Preview

| Login Page                          | Sign Up                              | App Page                           |
| ----------------------------------- | ------------------------------------ | ---------------------------------- |
| ![](docs/screenshot/Login-page.png) | ![](docs/screenshot/Signup-page.png) | ![](docs/screenshot/apps-page.png) |

---

## 🚀 Features

- 🔐 Secure User Authentication (Login/Signup)
- 🎲 Random One-to-One Private Chat
- 📡 Real-time Messaging with Socket.IO
- 📜 Chat History Persistence using MongoDB
- ✏️ Typing Indicator (optional)
- 🛡️ Protected Routes for Logged-in Users
- 🕒 Timestamped Messages
- 📱 Fully Responsive UI (Mobile & Desktop)

---

## 📦 Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or use local MongoDB)

  **Need help setting up MongoDB Atlas?** Follow this guide: [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)

After deploying a cluster:

1.  Click **Connect** → **Drivers**
2.  Select **Node.js** as the driver
3.  Copy the connection string and use it for `MONGO_URI` in `.env`

Example connection string:

```

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority

```

---

## ⚙️ Setup Instructions

Follow these steps to run the app locally:

### 1. Clone the Repository

```bash
git clone https://github.com/behan05/pairly.git
cd pairly
```

---

### 2. Set Up the Backend

Navigate into the server directory:

```bash
cd pairly-server
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Open the `.env` file and configure:

```env
PORT=5000
MONGO_URI=your_mongo_db_uri_here
JWT_SECRET=your_jwt_secret_here
```

Start the backend server:

```bash
npm start
```

You should see logs like:

```
Server running on port 5000...
Connected to MongoDB
```

---

### 3. Set Up the Frontend

In a new terminal window/tab:

```bash
cd pairly-ui
npm install
npm run dev
```

The app will open at: [http://localhost:5173/](http://localhost:5173)

---

## 🧯 Troubleshooting

Common issues and solutions:

- **MongooseServerSelectionError**: Double-check your MongoDB URI and internet connection.
- **Port already in use**: Change the `PORT` value in `.env`, or stop the conflicting process.
- **Frontend doesn’t load**: Ensure backend server is running correctly.

---

## 🧱 Tech Stack

**Frontend:**

- ⚛️ React + Vite
- 💅 Material UI (MUI)
- 🔁 React Router
- 📦 Redux or Context API
- 📢 Toastify
- 🌐 Socket.IO Client

**Backend:**

- 🟩 Node.js + Express
- 🛢️ MongoDB + Mongoose
- 🔐 JWT for Authentication
- 🔒 bcrypt for Hashing
- 📡 Socket.IO for Real-Time Comm

---

## 📁 Project Structure

```
pairly/
├── pairly-ui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── redux/ or context/
│   │   └── App.jsx
│   └── package.json
├── pairly-server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
├── docs/
│   ├── screenshot/
│   └── translations/
├── .env
└── README.md
```

---

## 🚀 Deployment

- **Frontend**: [Vercel](https://pairly.chat/)
- **Backend**: Render

---

## 🤝 Contributing

### Thinking of contributing?

Don't worry if you're new to open source — we're happy to help guide you! 😄
Just open an issue or comment on one you'd like to tackle.

### We welcome contributions!

If you're new to open source, here are some good first issues:

### 🔧 Good First Tasks:

- Improve error messages or user feedback
- Setup GitHub Actions for CI
- Add unit tests or end-to-end tests
- Improve accessibility
- Write documentation

### Steps to contribute:

- 🌱 Fork this repo
- 🛠️ Create your feature branch
- 🔃 Submit a Pull Request
- ❤️ Don't forget to star the project!

Be sure to read the [contributing guide](CONTRIBUTING.md) if available.

---

## 🙏 Made by Contributors

We are grateful to all contributors who make this better every day.
Add yourself in `CONTRIBUTORS.md` when you contribute!

---

## ❤️ Acknowledgements

Thanks to all contributors and open-source libraries used in this project.
This project wouldn't be possible without them!

---

## 📬 Contact

For questions or contributions, feel free to reach out:
✉️ [behankrbth@outlook.com](mailto:behankrbth@outlook.com)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE)

---
