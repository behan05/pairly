# 🌐 Connect UI – Real-Time Random Chat App (Frontend)

Welcome to the **frontend of "Connect"**, a modern real-time chat application where users can anonymously connect with random people from anywhere in the world.

---

## 📚 Project Purpose

This frontend handles:

- Real-time chat between random users (text-only in Phase 1)
- User authentication (login/signup)
- Public & private page access
- UI built with MUI and React
- Scalable project structure using best practices

---

## 🚀 Tech Stack

| Tool                 | Purpose                           |
| -------------------- | --------------------------------- |
| React 19             | UI framework                      |
| Vite                 | Build tool for fast dev & build   |
| React Router v7      | Routing                           |
| MUI (Material UI)    | UI components                     |
| Redux Toolkit        | State management                  |
| React Context API    | Auth & Socket state               |
| Socket.IO            | Real-time messaging               |
| Prettier + ESLint    | Code formatting & linting         |
| Axios (via services) | API requests (login, chat, match) |
| Day.js               | Date formatting                   |
| Toastify             | User notifications                |

---

## 📁 Folder Structure

```bash
src/
├── assets/             # Static files (logos, images, icons)
├── components/         # Reusable UI elements (buttons, headers, etc.)
│   ├── common/         # Shared across app
│   ├── public/         # Used in public pages
│   └── private/        # Used after login
├── context/            # React Context (Auth + Socket)
│   ├── AuthContext.jsx
│   └── SocketContext.jsx
├── middleware/         # Route protection logic (ProtectedRoute)
├── pages/              # Page views (grouped by access level)
│   ├── public/         # Login, Signup, Home
│   └── private/        # Chat, Profile, Settings
├── redux/              # Redux Toolkit slices + store
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       └── chatSlice.js
├── routes/             # Route definitions
│   └── AppRoutes.jsx
├── services/           # API call functions (login, chat, match)
│   ├── authService.js
│   ├── chatService.js
│   └── matchService.js
├── styles/             # Optional: global styles, MUI overrides
├── App.jsx             # App root wrapper
└── main.jsx            # ReactDOM rendering and context/redux setup
```

## 🧠 Explanation of Key Folders

✅ context/
Manages global state without Redux:

- AuthContext: user info, login/logout

- SocketContext: maintains a socket.io connection throughout the app

Use this when the state doesn't need Redux but should be global.

✅ redux/
Manages frequently changing app state:

- chatSlice: stores messages, typing indicators

- authSlice: (optional) syncs user info across app

- store.js: combines all slices

Use Redux when multiple components depend on shared, dynamic data.

✅ services/
Contains API logic (using Axios or Fetch):

- authService: login, register

- chatService: message send/fetch

- matchService: matchmaking endpoints

Keeps UI clean by separating business logic.

✅ middleware/
Protects private routes:

- ProtectedRoute.jsx: blocks unauthenticated access

✅ routes/
Central place to define all routes:

- Public routes: Home, Login, Signup

- Private routes: Chat, Profile

Helps manage navigation and access in one file.

## 🧪 Development Scripts

```base
# Install all dependencies
npm install

# Start development server
npm run dev

# Run ESLint (lint check)
npm run lint

# Auto-format files with Prettier
npm run format

# Build for production
npm run build

```

## 🧰 ESLint & Prettier Setup

- Uses modern ESLint v9+ flat config

- Integrated with Prettier

- Custom rule to allow PascalCase unused variables (common in React)

- Enforced formatting and best practices

## Format all files

```
npm run format

```
## Lint code:

```
npm run lint

```
## 🙌 Credits
Built with ❤️ by Behan Kumar
GitHub: @behan05


---

### ✅ You now have:

- Full folder guide
- Why/when to use context, redux, services, middleware
- Project tech stack
- Developer instructions

