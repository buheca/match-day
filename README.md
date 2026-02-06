
A modern web application designed to help users find players for sports matches using a swipe-based interface. Users can view player profiles, swipe right to invite/accept, or left to pass.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

* **Swipe Interface:** Tinder-like swipe mechanics to interact with player profiles (Built with React & Framer Motion logic).
* **Player Matching:** Match logic to connect teams with available players.
* **Responsive Design:** optimized for mobile and desktop views.
* **Modern Stack:** Built with Next.js 14 (App Router) and TypeScript.

## 🛠️ Tech Stack

### Client (Frontend)
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** Tailwind CSS (Assumed based on modern Next.js stacks)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Hooks (`useState`, `useEffect`)

### Server (Backend)
* **Runtime:** Node.js
* **Framework:** Express.js (Assumed)

---

## 📂 Project Structure

This project follows a monorepo-style structure separating the Frontend and Backend:

```bash
├── Client/         # Next.js Frontend Application
│   ├── src/
│   │   ├── app/    # App Router Pages
│   │   ├── components/ # UI Components (SwipeCard, etc.)
│   │   └── types/  # TypeScript Interfaces
│   └── public/
├── Server/         # Backend API (Node.js)
└── README.md
